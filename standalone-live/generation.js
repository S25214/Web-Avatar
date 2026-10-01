/* Standalone-only photo generation. No changes to shared widget runtimes. */
(() => {
    'use strict';
    const API_BASE = 'https://botnoi-image.didthat.workers.dev';
    const KEY_STORAGE = 'webavatar_generation_api_key';
    const SESSION_STORAGE = 'webavatar_generation_session';
    const JOB_STORAGE = 'webavatar_generation_pending_job';
    const RESULT_DISPLAY_MS = 30000;
    const config = window.StandaloneGenerationConfig || {};
    const POLL_INTERVAL = Math.max(1000, Math.min(10000, Number(config.pollIntervalMs) || 2500));
    const $ = id => document.getElementById(id);
    const readStorage = (storage, key) => { try { return window[storage].getItem(key); } catch { return null; } };
    const writeStorage = (storage, key, value) => { try { if (value === null) window[storage].removeItem(key); else window[storage].setItem(key, value); } catch {} };
    let apiKey = String(config.clientApiKey || readStorage('sessionStorage', KEY_STORAGE) || '').trim();
    const sessionId = String(config.sessionId || readStorage('localStorage', SESSION_STORAGE) || crypto.randomUUID());
    writeStorage('localStorage', SESSION_STORAGE, sessionId);
    $('generation-api-key').value = apiKey;

    let phase = 'idle';
    let currentJob = null;
    let lastPhoto = null;
    let lastPhotoOptions = null;
    let runVersion = 0;
    let jobController = null;
    let progressTimer = null;
    let danceState = null;
    let progressValue = 0;
    let phaseStartedAt = 0;
    let startedAt = 0;
    let currentResult = null;
    let resultTimer = null;
    let resultDeadline = 0;
    let resultOpenedFromGallery = false;
    let resultNavigationBusy = false;
    let closingResult = false;
    let exiting = false;
    const completedHere = new Map();
    const galleryItems = new Map();
    let galleryPage = 0;
    let galleryHasMore = false;
    let galleryLoading = false;
    let galleryVersion = 0;
    let galleryController = null;
    let galleryTotal = 0;
    let galleryDisplayPage = 0;
    let galleryCapacity = 1;
    let galleryColumns = 0;
    let galleryRows = 0;

    const busy = () => ['uploading', 'pending', 'processing', 'paused'].includes(phase);
    const safeImageUrl = value => {
        if (typeof value !== 'string' || !value) return null;
        try {
            const url = new URL(value, API_BASE);
            return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
        } catch { return null; }
    };

    class ApiError extends Error {
        constructor(message, status = 0) { super(message); this.status = status; }
    }

    function imageBlobToDataUrl(blob, signal) {
        if (!(blob instanceof Blob) || !/^image\/(jpeg|png|webp)$/.test(blob.type)) {
            throw new ApiError('The photo and background must be JPEG, PNG, or WebP images.');
        }
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const abort = () => reader.abort();
            const finish = (error, value) => {
                signal?.removeEventListener('abort', abort);
                if (error) reject(error);
                else resolve(value);
            };
            reader.onload = () => finish(null, reader.result);
            reader.onerror = () => finish(new ApiError('Could not prepare the image for upload. Please try again.'));
            reader.onabort = () => finish(new DOMException('Aborted', 'AbortError'));
            if (signal?.aborted) { finish(new DOMException('Aborted', 'AbortError')); return; }
            signal?.addEventListener('abort', abort, { once: true });
            try { reader.readAsDataURL(blob); }
            catch (error) { finish(error); }
        });
    }

    async function apiRequest(path, options = {}, signal) {
        const controller = new AbortController();
        const abort = () => controller.abort();
        if (signal?.aborted) controller.abort();
        else signal?.addEventListener('abort', abort, { once: true });
        const timeout = setTimeout(abort, 30000);
        try {
            // Credentials are sent only to the fixed generation API, never to image URLs.
            const headers = new Headers(options.headers || {});
            if (apiKey) headers.set('X-API-Key', apiKey);
            const response = await fetch(API_BASE + path, { ...options, headers, signal: controller.signal, credentials: 'omit' });
            const text = await response.text();
            let data;
            try { data = text ? JSON.parse(text) : {}; } catch { throw new ApiError('The image service returned an unreadable response.', response.status); }
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new ApiError('เพิ่มหรือแก้ไข API key ใน Settings → Bot settings แล้วลองอีกครั้ง', response.status);
                }
                const message = data.error_message || data.message || data.error?.message || data.error;
                throw new ApiError(typeof message === 'string' ? message : `The image service returned HTTP ${response.status}.`, response.status);
            }
            return data;
        } catch (error) {
            if (signal?.aborted) throw error;
            if (error.name === 'AbortError') throw new ApiError('The image service took too long to respond.');
            if (error instanceof ApiError) throw error;
            throw new ApiError('Could not reach the image service. Check your connection and the service’s allowed origins.');
        } finally {
            clearTimeout(timeout);
            signal?.removeEventListener('abort', abort);
        }
    }

    function delay(ms, signal) {
        return new Promise((resolve, reject) => {
            if (signal.aborted) { reject(new DOMException('Aborted', 'AbortError')); return; }
            const abort = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); };
            const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, ms);
            signal.addEventListener('abort', abort, { once: true });
        });
    }

    function rememberJob(job) {
        writeStorage('localStorage', JOB_STORAGE, job ? JSON.stringify({ id: job.id, sessionId, startedAt, qr_image_url: safeImageUrl(job.qr_image_url) }) : null);
    }

    function stopEntertainment() {
        clearInterval(progressTimer);
        progressTimer = null;
        document.body.classList.remove('generation-waiting');
        document.body.classList.remove('generation-dancing');
        const state = danceState;
        danceState = null;
        if (state) { state.active = false; restoreWaitingDance(state); }
    }

    function restoreWaitingDance(state) {
        if (!state.loaded || state.restored || danceState?.active || window.WebAvatar !== state.avatar ||
            state.avatar.getActiveAvatarContext?.() !== state.context) return;
        state.restored = true;
        Promise.resolve().then(() => {
            if (!danceState?.active && window.WebAvatar === state.avatar && state.avatar.getActiveAvatarContext?.() === state.context) return state.avatar.loadAnimation(state.idle);
        }).catch(() => {});
    }

    async function startWaitingDance() {
        const avatar = window.WebAvatar;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            !avatar?.getAssetManifest || !avatar.loadAnimation) return;
        const state = { avatar, context: avatar.getActiveAvatarContext?.(), active: true, loaded: false, restored: false };
        danceState = state;
        try {
            const manifest = await avatar.getAssetManifest({ widgetId: window.ChatWidgetConfig?.widgetId || '' });
            if (!state.active || window.WebAvatar !== avatar || avatar.getActiveAvatarContext?.() !== state.context) return;
            const ids = (manifest.animations || []).map(animation => animation.id);
            const dance = [config.waitingDanceAnimation, 'ArmWaveDanceloop', 'Dance_Doodleloop', 'Excited_dance', ...ids.filter(id => /dance|dancing/i.test(id))]
                .find(id => ids.includes(id) && (!avatar.resolveAnimationCandidates || avatar.resolveAnimationCandidates(id).length));
            state.idle = [config.waitingIdleAnimation, ...(manifest.defaultAnimationIds || []), ...ids.filter(id => /idle/i.test(id))]
                .find(id => ids.includes(id) && (!avatar.resolveAnimationCandidates || avatar.resolveAnimationCandidates(id).length));
            if (!dance || !state.idle) return;
            const result = await avatar.loadAnimation(dance);
            if (result?.ok === false) return;
            state.loaded = true;
            if (state.active && window.WebAvatar === avatar && avatar.getActiveAvatarContext?.() === state.context) document.body.classList.add('generation-dancing');
            else restoreWaitingDance(state); // A slow animation load may finish after the job.
        } catch {} // Keep the gentle page animation if a dance asset is unavailable.
    }

    function updateProgressBar() {
        const seconds = Math.max(0, (Date.now() - phaseStartedAt) / 1000);
        const bounds = phase === 'uploading' ? [8, 24] : phase === 'pending' ? [28, 48] : [55, 94];
        if (['uploading', 'pending', 'processing'].includes(phase)) {
            progressValue = Math.max(progressValue, bounds[0] + (bounds[1] - bounds[0]) * (1 - Math.exp(-seconds / 25)));
        }
        $('generation-progress-fill').style.width = `${progressValue}%`;
        $('generation-progress-bar').setAttribute('aria-valuenow', String(Math.round(progressValue)));
        $('generation-progress-bar').setAttribute('aria-valuetext', `${$('generation-progress-status').textContent} ความคืบหน้าโดยประมาณ รอระบบยืนยันว่าสร้างภาพเสร็จแล้ว`);
    }

    function updateProgressQr() {
        const image = $('generation-progress-qr-image');
        const placeholder = $('generation-progress-qr-placeholder');
        const jobId = currentJob?.id;
        const url = safeImageUrl(currentJob?.qr_image_url);
        if (!url) {
            image.onload = null;
            image.onerror = null;
            image.removeAttribute('src');
            image.hidden = true;
            placeholder.hidden = false;
            placeholder.textContent = ['error', 'cancelled'].includes(phase) ? 'ไม่มี QR' : 'กำลังเตรียม QR';
            return;
        }
        if (image.getAttribute('src') === url) return;
        image.hidden = true;
        placeholder.hidden = false;
        placeholder.textContent = 'กำลังโหลด QR';
        image.onload = () => {
            if (currentJob?.id !== jobId || image.getAttribute('src') !== url) return;
            image.hidden = false;
            placeholder.hidden = true;
        };
        image.onerror = () => {
            if (currentJob?.id !== jobId || image.getAttribute('src') !== url) return;
            image.hidden = true;
            placeholder.hidden = false;
            placeholder.textContent = 'โหลด QR ไม่สำเร็จ';
        };
        image.src = url;
    }

    function startEntertainment() {
        stopEntertainment();
        document.body.classList.add('generation-waiting');
        startWaitingDance();
        const lines = ['Avatar อยู่เป็นเพื่อนระหว่างรอ', 'กำลังเติมจินตนาการให้ภาพของคุณ', 'รูปใหม่ของคุณกำลังเป็นรูปเป็นร่าง', 'กำลังเก็บรายละเอียดให้ภาพสมบูรณ์'];
        const update = () => {
            const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
            $('generation-elapsed').textContent = `${elapsed} วิ`;
            $('generation-entertainment').textContent = lines[Math.floor(elapsed / 7) % lines.length];
            updateProgressBar();
        };
        update();
        progressTimer = setInterval(update, 1000);
    }

    function setProgress(nextPhase, message) {
        const enteredError = nextPhase === 'error' && phase !== 'error';
        if (phase !== nextPhase) phaseStartedAt = Date.now();
        phase = nextPhase;
        $('generation-progress').hidden = false;
        $('generation-progress').dataset.state = phase;
        $('generation-progress-status').textContent = message;
        $('generation-progress-title').textContent = phase === 'error' ? 'สร้างภาพไม่สำเร็จ' : phase === 'paused' ? 'งานสร้างภาพยังถูกบันทึกไว้' : phase === 'cancelled' ? 'หยุดติดตามรูปนี้แล้ว' : 'กำลังสร้างรูปของคุณ';
        const recover = ['error', 'paused', 'cancelled'].includes(phase);
        $('generation-recovery-actions').hidden = !busy() && !recover;
        $('generation-cancel-btn').hidden = !busy();
        $('generation-resume-btn').hidden = phase !== 'paused' || !currentJob;
        $('generation-retry-btn').hidden = !recover || !lastPhoto;
        $('generation-dismiss-btn').hidden = !['error', 'cancelled'].includes(phase);
        $('camera-open-btn').disabled = busy();
        $('camera-open-btn').title = busy() ? 'กำลังสร้างภาพของคุณ' : 'เปิดกล้อง';
        $('generated-gallery-photo').disabled = busy();
        $('generated-result-again').disabled = busy();
        $('photo-setup-retake').disabled = busy();
        updateProgressQr();
        updateProgressBar();
        if (recover) {
            stopEntertainment();
            $('generation-entertainment').textContent = phase === 'paused' ? 'ตรวจสอบงานเดิมต่อได้ หรือสร้างรูปนี้ใหม่' : phase === 'cancelled' ? 'ถ้าระบบรับงานไปแล้ว รูปอาจยังปรากฏในแกลเลอรี' : 'ยังเปิดแกลเลอรีดูรูปได้ระหว่างแก้ไข';
        }
        if (enteredError) {
            window.StandaloneVoice?.notifyChat('[SYSTEM] Photo generation failed. Ask user to check the gallery, retry generating the photo, or take a new photo.');
        }
    }

    function cancelGeneration() {
        if (!busy()) return;
        ++runVersion;
        jobController?.abort();
        jobController = null;
        currentJob = null;
        rememberJob(null);
        setProgress('cancelled', 'หยุดส่งหรือตรวจสอบรูปนี้แล้ว คุณสามารถสร้างใหม่จากรูปเดิมได้');
    }

    function regenerateLatest() {
        if (!lastPhoto || !['error', 'paused', 'cancelled'].includes(phase)) return;
        if (phase === 'paused') phase = 'cancelled';
        generatePhoto(lastPhoto, lastPhotoOptions || {});
    }

    function finishProgress() {
        phase = 'idle';
        $('generation-progress').hidden = true;
        $('camera-open-btn').disabled = false;
        $('camera-open-btn').title = 'เปิดกล้อง';
        $('generated-gallery-photo').disabled = false;
        $('generated-result-again').disabled = false;
        $('photo-setup-retake').disabled = false;
        updateProgressQr();
        stopEntertainment();
    }

    async function pollJob(version, controller) {
        let consecutiveErrors = 0;
        const pollStarted = Date.now();
        while (!controller.signal.aborted && version === runVersion) {
            if (Date.now() - pollStarted > 15 * 60 * 1000) {
                setProgress('paused', 'This is taking longer than usual. Your job may still be running. Continue checking when you are ready.');
                return;
            }
            let job;
            try {
                job = await apiRequest(`/api/generations/${encodeURIComponent(currentJob.id)}`, {}, controller.signal);
                consecutiveErrors = 0;
            } catch (error) {
                if (controller.signal.aborted || version !== runVersion) return;
                consecutiveErrors++;
                if (error.status === 401 || error.status === 403 || consecutiveErrors >= 5) {
                    setProgress('paused', error.message);
                    return;
                }
                $('generation-progress-status').textContent = 'การเชื่อมต่อสะดุด กำลังตรวจสอบงานเดิมอีกครั้ง…';
                await delay(Math.min(10000, POLL_INTERVAL * consecutiveErrors), controller.signal);
                continue;
            }
            if (version !== runVersion) return;
            if (job.id && job.id !== currentJob.id) throw new ApiError('The image service returned a different job. Continue checking your gallery.');
            if (job.status === 'completed') {
                const url = safeImageUrl(job.result_image_url);
                if (!url) { setProgress('paused', 'The job finished but its image link is not ready. Continue checking shortly.'); return; }
                const completed = { ...currentJob, ...job, qr_image_url: safeImageUrl(job.qr_image_url) || safeImageUrl(currentJob.qr_image_url), result_image_url: url, session_id: job.session_id || sessionId };
                completedHere.set(completed.id, completed);
                galleryTotal++;
                updateGalleryCount();
                renderGallery();
                rememberJob(null);
                currentJob = null;
                lastPhoto = null;
                lastPhotoOptions = null;
                finishProgress();
                if ($('generated-gallery-dialog').open) $('generated-gallery-dialog').close();
                showResult(completed);
                window.StandaloneVoice?.notifyChat('[SYSTEM] Photo generation succeeded. Currently previewing the generated photo. Ask user to scan the QR code to download it, view the gallery, or take a new photo.');
                return;
            }
            if (job.status === 'failed') {
                rememberJob(null);
                currentJob = null;
                setProgress('error', typeof job.error_message === 'string' ? job.error_message : 'The image could not be generated. Take another photo or retry this one.');
                return;
            }
            if (!['pending', 'processing'].includes(job.status)) {
                setProgress('paused', 'The image service returned an unexpected status. Continue checking shortly.');
                return;
            }
            currentJob = { ...currentJob, ...job, qr_image_url: safeImageUrl(job.qr_image_url) || safeImageUrl(currentJob.qr_image_url) };
            rememberJob(currentJob);
            setProgress(job.status, job.status === 'pending' ? 'อยู่ในคิว — กำลังรอสร้างภาพของคุณ' : 'กำลังประมวลผล — กำลังสร้างภาพของคุณ');
            await delay(POLL_INTERVAL, controller.signal);
        }
    }

    async function generatePhoto(file, options = {}) {
        if (busy() || !(file instanceof Blob)) return;
        const version = ++runVersion;
        jobController?.abort();
        jobController = new AbortController();
        const controller = jobController;
        lastPhoto = file;
        lastPhotoOptions = {
            backgroundImage: Object.prototype.hasOwnProperty.call(options, 'backgroundImage') ? options.backgroundImage : config.backgroundImage,
            visualStyle: Object.prototype.hasOwnProperty.call(options, 'visualStyle') ? options.visualStyle : config.visualStyle
        };
        currentJob = null;
        rememberJob(null);
        startedAt = Date.now();
        progressValue = 0;
        window.closeCameraDialog();
        window.setSettingsOpen(false, false);
        setProgress('uploading', 'กำลังส่งรูปของคุณ…');
        startEntertainment();
        try {
            const body = { image: await imageBlobToDataUrl(file, controller.signal), session_id: sessionId };
            const background = lastPhotoOptions.backgroundImage;
            if (background instanceof Blob) body.background_image = await imageBlobToDataUrl(background, controller.signal);
            else if (typeof background === 'string' && /^data:image\/(jpeg|png|webp);base64,/.test(background)) body.background_image = background;
            else if (background != null && background !== '') throw new ApiError('backgroundImage must be an image Blob/File or a JPEG, PNG, or WebP base64 data URL.');
            if (typeof lastPhotoOptions.visualStyle === 'string' && lastPhotoOptions.visualStyle.trim()) body.visual_style = lastPhotoOptions.visualStyle.trim();
            if (controller.signal.aborted || version !== runVersion) return;
            const created = await apiRequest('/api/generations', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            }, controller.signal);
            if (controller.signal.aborted || version !== runVersion) return;
            if (typeof created.id !== 'string' || !created.id) throw new ApiError('The service did not return a job ID. Check the gallery before retrying your photo.');
            currentJob = created;
            rememberJob(currentJob);
            setProgress('pending', 'ส่งรูปแล้ว กำลังตรวจสอบสถานะการสร้างภาพ…');
            await pollJob(version, controller);
        } catch (error) {
            if (controller.signal.aborted || version !== runVersion || exiting) return;
            if (currentJob) setProgress('paused', error.message);
            else setProgress('error', `${error.message}${error.status ? '' : ' Check the gallery before retrying; your upload may have been accepted.'}`);
        }
    }

    async function resumeJob() {
        if (!currentJob || (phase !== 'paused' && phase !== 'idle')) return;
        const version = ++runVersion;
        jobController?.abort();
        jobController = new AbortController();
        const controller = jobController;
        setProgress('pending', 'กำลังตรวจสอบงานสร้างภาพเดิม…');
        startEntertainment();
        try { await pollJob(version, controller); }
        catch (error) { if (!controller.signal.aborted && version === runVersion) setProgress('paused', error.message); }
    }

    function clearResultTimer() {
        clearTimeout(resultTimer);
        resultTimer = null;
        resultDeadline = 0;
    }

    function startResultTimer() {
        clearResultTimer();
        resultDeadline = Date.now() + RESULT_DISPLAY_MS;
        resultTimer = setTimeout(() => closeResult(), RESULT_DISPLAY_MS);
    }

    function showResult(job, fromGallery = false) {
        const url = safeImageUrl(job.result_image_url);
        if (!url) return;
        currentResult = { ...job, result_image_url: url };
        resultOpenedFromGallery = fromGallery;
        $('generated-result-back').hidden = !fromGallery;
        closingResult = false;
        $('generated-result-status').textContent = 'สแกน QR เพื่อดาวน์โหลด · รูปจะปิดใน 30 วินาที';
        const image = $('generated-result-image');
        image.onerror = () => { $('generated-result-status').textContent = 'โหลดภาพไม่สำเร็จ ลองเปิดรูปนี้จากแกลเลอรีอีกครั้ง'; };
        image.src = url;
        const qr = $('generated-result-qr');
        const qrUrl = safeImageUrl(job.qr_image_url);
        qr.onerror = null;
        qr.removeAttribute('src');
        qr.parentElement.hidden = !qrUrl;
        qr.onerror = () => {
            if (currentResult?.id !== job.id || qr.getAttribute('src') !== qrUrl) return;
            qr.parentElement.hidden = true;
            $('generated-result-status').textContent = 'โหลด QR ไม่สำเร็จ ลองเปิดรูปนี้จากแกลเลอรีอีกครั้ง';
        };
        if (qrUrl) qr.src = qrUrl;
        else $('generated-result-status').textContent = 'API ยังไม่มี QR สำหรับรูปนี้';
        if (!$('generated-result-dialog').open) $('generated-result-dialog').showModal();
        startResultTimer();
        updateResultBrowse();
    }

    function updateResultBrowse() {
        $('generated-result-browse').hidden = !resultOpenedFromGallery || !currentResult;
        if (!resultOpenedFromGallery || !currentResult) return;
        const items = visibleGalleryItems();
        const index = items.findIndex(job => job.id === currentResult.id);
        $('generated-result-position').textContent = index < 0 ? 'รูปในแกลเลอรี' : `รูปที่ ${index % galleryCapacity + 1} · หน้า ${Math.floor(index / galleryCapacity) + 1}`;
        $('generated-result-previous').disabled = resultNavigationBusy || galleryLoading || index <= 0;
        $('generated-result-next').disabled = resultNavigationBusy || galleryLoading || (index >= items.length - 1 && !galleryHasMore);
    }

    async function viewAdjacentPhoto(direction) {
        if (!resultOpenedFromGallery || !currentResult || resultNavigationBusy || galleryLoading) return;
        const selected = currentResult;
        resultNavigationBusy = true;
        updateResultBrowse();
        try {
            let items = visibleGalleryItems();
            let index = items.findIndex(job => job.id === selected.id);
            if (direction > 0 && index === items.length - 1 && galleryHasMore) {
                await loadGallery(false);
                items = visibleGalleryItems();
                index = items.findIndex(job => job.id === selected.id);
            }
            if (currentResult !== selected || !$('generated-result-dialog').open || index < 0) return;
            const next = index + direction;
            if (!items[next]) return;
            galleryDisplayPage = Math.floor(next / galleryCapacity);
            showResult(items[next], true);
            renderGallery();
        } finally {
            resultNavigationBusy = false;
            updateResultBrowse();
        }
    }

    function closeImageViews() {
        clearResultTimer();
        window.StandalonePhotoFlow?.close();
        if ($('generated-result-dialog').open) $('generated-result-dialog').close();
        if ($('generated-gallery-dialog').open) $('generated-gallery-dialog').close();
        currentResult = null;
        resultOpenedFromGallery = false;
        closingResult = false;
        updateResultBrowse();
    }

    async function closeResult(takeAnother = false) {
        if (takeAnother && busy()) return;
        if (closingResult || !$('generated-result-dialog').open) return;
        clearResultTimer();
        closingResult = true;
        const image = $('generated-result-image');
        const from = image.getBoundingClientRect();
        const closingJob = currentResult;
        const url = currentResult?.result_image_url;
        $('generated-result-dialog').close();
        if (url && from.width && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const target = $('generated-gallery-btn').getBoundingClientRect();
            const flying = document.createElement('img');
            flying.src = url; flying.alt = ''; flying.className = 'generation-flying-image';
            flying.style.left = `${from.left}px`; flying.style.top = `${from.top}px`;
            flying.style.width = `${from.width}px`; flying.style.height = `${from.height}px`;
            document.body.appendChild(flying);
            try {
                const animation = flying.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${target.left + target.width / 2 - from.left - from.width / 2}px, ${target.top + target.height / 2 - from.top - from.height / 2}px) scale(${48 / Math.max(from.width, from.height)})`, opacity: 0.15 }
                ], { duration: 650, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
                await animation.finished;
            } catch {} finally { flying.remove(); }
        }
        if (currentResult === closingJob) {
            closingResult = false;
            currentResult = null;
            if (takeAnother) {
                window.openCameraDialog();
            }
        }
    }

    function backToGallery() {
        if (closingResult || !resultOpenedFromGallery || !$('generated-result-dialog').open) return;
        clearResultTimer();
        const id = currentResult?.id;
        $('generated-result-dialog').close();
        currentResult = null;
        resultOpenedFromGallery = false;
        $('generated-gallery-dialog').showModal();
        sizeGallery();
        renderGallery();
        const selected = [...$('generated-gallery-grid').querySelectorAll('button')].find(button => button.dataset.generationId === id);
        (selected || $('generated-gallery-close')).focus();
    }

    function visibleGalleryItems() {
        const merged = new Map(galleryItems);
        completedHere.forEach((job, id) => merged.set(id, job));
        return [...merged.values()].filter(job => job.status === 'completed' && safeImageUrl(job.result_image_url))
            .sort((a, b) => (Number(b.created_at) || 0) - (Number(a.created_at) || 0));
    }

    function updateGalleryCount() {
        $('generated-gallery-count').textContent = String(Math.max(galleryTotal, visibleGalleryItems().length));
    }

    function renderGallery() {
        const grid = $('generated-gallery-grid');
        const items = visibleGalleryItems();
        const pages = Math.max(1, Math.ceil(Math.max(galleryTotal, items.length) / galleryCapacity));
        galleryDisplayPage = Math.min(galleryDisplayPage, pages - 1);
        grid.replaceChildren();
        const start = galleryDisplayPage * galleryCapacity;
        for (const [position, job] of items.slice(start, start + galleryCapacity).entries()) {
            const figure = document.createElement('figure'); figure.className = 'generated-gallery-item';
            const button = document.createElement('button'); button.type = 'button';
            const photoNumber = position + 1;
            button.id = `gallery-photo-${job.id}`;
            button.setAttribute('aria-label', `เปิดรูปที่ ${photoNumber} ในหน้า ${galleryDisplayPage + 1} (Open photo ${photoNumber})`);
            button.dataset.generationId = job.id;
            const image = document.createElement('img'); image.src = safeImageUrl(job.result_image_url); image.alt = 'Generated photo'; image.loading = 'lazy';
            button.appendChild(image);
            const number = document.createElement('span'); number.className = 'gallery-photo-number';
            number.textContent = String(photoNumber); number.setAttribute('aria-hidden', 'true');
            button.appendChild(number);
            button.addEventListener('click', () => { $('generated-gallery-dialog').close(); showResult(job, true); });
            const caption = document.createElement('figcaption');
            const date = new Date(Number(job.created_at));
            caption.textContent = `รูปที่ ${photoNumber} · ${Number.isFinite(date.getTime()) ? date.toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }) : 'ภาพที่สร้างแล้ว'}`;
            figure.append(button, caption); grid.appendChild(figure);
        }
        $('generated-gallery-page').textContent = `หน้า ${galleryDisplayPage + 1} / ${pages}`;
        $('generated-gallery-previous').disabled = galleryLoading || galleryDisplayPage === 0;
        $('generated-gallery-next').disabled = galleryLoading || (start + galleryCapacity >= items.length && !galleryHasMore);
        updateGalleryCount();
        updateResultBrowse();
    }

    function sizeGallery() {
        if (!$('generated-gallery-dialog').open) return;
        const grid = $('generated-gallery-grid');
        const gap = parseFloat(getComputedStyle(grid).gap) || 14;
        const columns = Math.max(1, Math.floor((grid.clientWidth + gap) / ((window.innerWidth <= 600 ? 140 : 200) + gap)));
        const cardWidth = (grid.clientWidth - gap * (columns - 1)) / columns;
        const rows = Math.max(1, Math.floor((grid.clientHeight + gap) / (cardWidth * 0.75 + 32 + gap)));
        const columnTemplate = `repeat(${columns}, minmax(0, 1fr))`;
        const rowTemplate = `repeat(${rows}, minmax(0, 1fr))`;
        if (galleryColumns === columns && galleryRows === rows) return;
        galleryColumns = columns;
        galleryRows = rows;
        const anchor = galleryDisplayPage * galleryCapacity;
        galleryCapacity = columns * rows;
        galleryDisplayPage = Math.floor(anchor / galleryCapacity);
        grid.style.gridTemplateColumns = columnTemplate;
        grid.style.gridTemplateRows = rowTemplate;
        renderGallery();
    }

    async function fillGalleryPage() {
        if (!$('generated-gallery-dialog').open) return;
        const version = galleryVersion;
        while (version === galleryVersion && !galleryLoading && galleryHasMore &&
            visibleGalleryItems().length < (galleryDisplayPage + 1) * galleryCapacity) {
            const previousPage = galleryPage;
            await loadGallery(false);
            if (galleryPage === previousPage) break; // Keep navigation usable after a failed request.
        }
    }

    async function changeGalleryPage(direction) {
        if (galleryLoading) return;
        galleryDisplayPage = Math.max(0, galleryDisplayPage + direction);
        renderGallery();
        await fillGalleryPage();
    }

    async function refreshGallery() {
        await loadGallery(true);
        await fillGalleryPage();
    }

    async function loadGallery(reset = true) {
        if (galleryLoading && !reset) return;
        if (reset) {
            galleryController?.abort();
            galleryVersion++;
            galleryPage = 0;
            galleryDisplayPage = 0;
            galleryTotal = 0;
            galleryHasMore = false;
            galleryItems.clear();
            renderGallery();
        }
        const version = galleryVersion;
        galleryController = new AbortController();
        const controller = galleryController;
        galleryLoading = true;
        $('generated-gallery-refresh').disabled = true;
        renderGallery();
        $('generated-gallery-status').textContent = 'กำลังโหลดรูปภาพ…';
        const nextPage = galleryPage + 1;
        const query = new URLSearchParams({ page: String(nextPage), limit: '12', status: 'completed' });
        if ($('generated-gallery-scope').value === 'session') query.set('session_id', sessionId);
        try {
            if (!apiKey) throw new ApiError('แกลเลอรีต้องใช้ CLIENT_API_KEY กรุณาบันทึกใน Settings → Bot settings แล้วรีเฟรชแกลเลอรี', 401);
            const data = await apiRequest(`/api/generations?${query}`, {}, controller.signal);
            if (version !== galleryVersion || controller.signal.aborted) return;
            if (!Array.isArray(data.items)) throw new ApiError('The gallery response did not contain an image list.');
            for (const job of data.items) if (typeof job.id === 'string') galleryItems.set(job.id, job);
            galleryPage = nextPage;
            galleryHasMore = data.hasMore === true;
            galleryTotal = Number.isFinite(Number(data.total)) ? Number(data.total) : galleryItems.size;
            renderGallery();
            const count = visibleGalleryItems().length;
            $('generated-gallery-status').textContent = count ? `${Math.max(galleryTotal, count)} ภาพในแกลเลอรี` : 'ยังไม่มีรูปภาพ ถ่ายรูปเพื่อเริ่มเก็บภาพของคุณ';
        } catch (error) {
            if (version === galleryVersion && !controller.signal.aborted) $('generated-gallery-status').textContent = `${error.message} กดรีเฟรชเพื่อลองอีกครั้ง`;
        } finally {
            if (version === galleryVersion) {
                galleryLoading = false;
                $('generated-gallery-refresh').disabled = false;
                renderGallery();
            }
        }
    }

    function openGallery() {
        if ($('generated-result-dialog').open && resultOpenedFromGallery) { backToGallery(); return; }
        if ($('generated-gallery-dialog').open) return;
        if ($('camera-dialog').open) window.closeCameraDialog();
        closeImageViews();
        if (!$('generated-gallery-dialog').open) $('generated-gallery-dialog').showModal();
        sizeGallery();
        refreshGallery();
    }

    $('generation-api-key-form').addEventListener('submit', event => {
        event.preventDefault();
        apiKey = $('generation-api-key').value.trim();
        writeStorage('sessionStorage', KEY_STORAGE, apiKey || null);
        $('generation-key-status').textContent = apiKey ? 'API key saved for this tab.' : 'API key cleared. Save a key to load the gallery.';
    });
    $('generated-gallery-btn').addEventListener('click', openGallery);
    $('generated-gallery-close').addEventListener('click', () => $('generated-gallery-dialog').close());
    $('generated-gallery-refresh').addEventListener('click', refreshGallery);
    $('generated-gallery-previous').addEventListener('click', () => changeGalleryPage(-1));
    $('generated-gallery-next').addEventListener('click', () => changeGalleryPage(1));
    $('generated-gallery-scope').addEventListener('change', refreshGallery);
    new ResizeObserver(() => { sizeGallery(); fillGalleryPage(); }).observe($('generated-gallery-grid'));
    $('generated-gallery-photo').addEventListener('click', () => {
        window.openCameraDialog();
    });
    $('generated-result-close').addEventListener('click', () => closeResult());
    $('generated-result-back').addEventListener('click', backToGallery);
    $('generated-result-previous').addEventListener('click', () => viewAdjacentPhoto(-1));
    $('generated-result-next').addEventListener('click', () => viewAdjacentPhoto(1));
    $('generated-result-again').addEventListener('click', () => closeResult(true));
    $('generated-result-dialog').addEventListener('cancel', event => { event.preventDefault(); closeResult(); });
    $('generated-result-dialog').addEventListener('close', clearResultTimer);
    $('generation-resume-btn').addEventListener('click', resumeJob);
    $('generation-cancel-btn').addEventListener('click', cancelGeneration);
    $('generation-retry-btn').addEventListener('click', regenerateLatest);
    $('generation-dismiss-btn').addEventListener('click', () => {
        if (!['error', 'cancelled'].includes(phase)) return;
        lastPhoto = null;
        lastPhotoOptions = null;
        finishProgress();
    });
    window.addEventListener('pagehide', () => {
        exiting = true;
        jobController?.abort(); galleryController?.abort(); stopEntertainment(); clearResultTimer();
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden || !resultDeadline || !$('generated-result-dialog').open) return;
        clearTimeout(resultTimer);
        const remaining = resultDeadline - Date.now();
        if (remaining <= 0) closeResult();
        else resultTimer = setTimeout(() => closeResult(), remaining);
    });
    window.addEventListener('pageshow', event => {
        if (event.persisted) {
            exiting = false;
            if (currentJob && busy()) { phase = 'paused'; resumeJob(); }
        }
    });
    window.StandaloneGeneration = { generatePhoto, isBusy: busy, openGallery, closeImageViews, showProgress: () => { $('generation-progress').hidden = false; } };

    // Resume accepted jobs after refresh without creating a second generation.
    try {
        const pending = JSON.parse(readStorage('localStorage', JOB_STORAGE) || 'null');
        if (pending && pending.sessionId === sessionId && typeof pending.id === 'string' && pending.id) {
            currentJob = { id: pending.id, qr_image_url: safeImageUrl(pending.qr_image_url) };
            startedAt = Number(pending.startedAt) || Date.now();
            phase = 'paused';
            resumeJob();
        }
    } catch { writeStorage('localStorage', JOB_STORAGE, null); }
})();
