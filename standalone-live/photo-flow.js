/* Keep the photo on screen while choosing the optional API background and style. */
(() => {
    'use strict';
    const $ = id => document.getElementById(id);
    const styles = {
        chibi: 'an adorable classic chibi anime 3D character. Keep the recognizable hairstyle, facial expression, and clothing colors from the original photo, but render the character with an oversized head, tiny rounded body, big sparkling eyes, and soft rosy blush. Clean cel-shaded anime style, bright flat colors, subtle drop shadow',
        anime: '80s vintage anime aesthetic, warm sunset glow, soft film grain',
        default: ''
    };
    const backgrounds = [
        { id: 'default', label: 'Default', url: null },
        { id: 'botnoi', label: 'BOTNOI', url: './standalone-live/backgrounds/botnoi.jpg' },
        { id: 'rainbow', label: 'Rainbow', url: './standalone-live/backgrounds/rainbow.jpg' },
        { id: 'golden', label: 'Golden', url: './standalone-live/backgrounds/golden.jpg' }
    ];
    let photo = null, photoUrl = null, selectedBackground = backgrounds[0], selectedStyle = 'default';
    let submitting = false, version = 0, controller = null;

    function enableChoices(enabled) {
        document.querySelectorAll('#photo-background-grid button, #photo-style-options button, #photo-setup-retake, #photo-setup-generate').forEach(button => { button.disabled = !enabled; });
    }
    function showSelection() {
        document.querySelectorAll('#photo-background-grid button').forEach(button => {
            button.setAttribute('aria-pressed', String(button.id === `photo-background-${selectedBackground.id}`));
        });
        document.querySelectorAll('#photo-style-options button').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.photoStyle === selectedStyle));
        });
    }
    function close() {
        version++;
        controller?.abort(); controller = null;
        $('photo-setup-dialog').close();
        if (photoUrl) URL.revokeObjectURL(photoUrl);
        photo = null; photoUrl = null; selectedBackground = backgrounds[0]; selectedStyle = 'default'; submitting = false;
        $('photo-setup-image').removeAttribute('src');
        enableChoices(true);
    }
    function chooseBackground(background) {
        if (!photo || submitting) return;
        selectedBackground = background;
        showSelection();
        $('photo-setup-status').textContent = '';
    }
    function chooseStyle(style) {
        if (!photo || submitting || !Object.prototype.hasOwnProperty.call(styles, style)) return;
        selectedStyle = style;
        showSelection();
        $('photo-setup-status').textContent = '';
    }
    for (const [index, background] of backgrounds.entries()) {
        const button = document.createElement('button'); button.type = 'button';
        button.id = `photo-background-${background.id}`;
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-label', background.url ? `พื้นหลัง ${index} ${background.label} (Background ${index})` : 'พื้นหลัง Default (Default background)');
        if (background.url) {
            const image = document.createElement('img'); image.src = background.url; image.alt = background.label; image.loading = 'eager'; image.decoding = 'async';
            button.appendChild(image);
        } else {
            const icon = document.createElement('span'); icon.className = 'photo-default-background'; icon.textContent = '✦'; icon.setAttribute('aria-hidden', 'true'); button.appendChild(icon);
        }
        const label = document.createElement('span'); label.textContent = background.label; button.appendChild(label);
        button.addEventListener('click', () => chooseBackground(background));
        $('photo-background-grid').appendChild(button);
    }
    async function generate() {
        if (!photo || submitting) return;
        submitting = true; enableChoices(false);
        const snapshot = version, captured = photo, background = selectedBackground, style = selectedStyle;
        controller = new AbortController();
        const timer = setTimeout(() => controller?.abort(), 20000);
        $('photo-setup-status').textContent = 'กำลังเตรียมภาพ…';
        try {
            let backgroundImage = null;
            if (background.url) {
                const response = await fetch(background.url, { signal: controller.signal, credentials: 'omit' });
                if (!response.ok) throw new Error('โหลดพื้นหลังไม่สำเร็จ เลือกพื้นหลังอื่นหรือลองใหม่');
                const blob = await response.blob();
                if (!/^image\/(jpeg|png|webp)$/.test(blob.type)) throw new Error('ไฟล์พื้นหลังต้องเป็น JPEG, PNG หรือ WebP');
                backgroundImage = new File([blob], `${background.id}.jpg`, { type: blob.type });
            }
            if (snapshot !== version || !$('photo-setup-dialog').open) return;
            if (!window.StandaloneGeneration) throw new Error('ระบบสร้างภาพยังไม่พร้อม ลองใหม่อีกครั้ง');
            clearTimeout(timer);
            close();
            window.StandaloneGeneration.generatePhoto(captured, { backgroundImage, visualStyle: styles[style] });
        } catch (error) {
            if (snapshot !== version) return;
            $('photo-setup-status').textContent = error.name === 'AbortError' ? 'โหลดพื้นหลังนานเกินไป ลองใหม่หรือเลือก Default' : error.message;
            submitting = false; enableChoices(true);
        } finally { clearTimeout(timer); }
    }
    function open(file) {
        if (!(file instanceof Blob) || window.StandaloneGeneration?.isBusy()) return;
        window.StandaloneGeneration?.closeImageViews();
        close();
        window.closeCameraDialog();
        photo = file; photoUrl = URL.createObjectURL(file);
        $('photo-setup-image').src = photoUrl;
        showSelection();
        $('photo-setup-status').textContent = '';
        $('photo-setup-dialog').showModal();
    }
    document.querySelectorAll('[data-photo-style]').forEach(button => button.addEventListener('click', () => chooseStyle(button.dataset.photoStyle)));
    $('photo-setup-generate').addEventListener('click', generate);
    $('photo-setup-close').addEventListener('click', close);
    $('photo-setup-dialog').addEventListener('cancel', event => { event.preventDefault(); close(); });
    $('photo-setup-retake').addEventListener('click', () => { close(); window.openCameraDialog(); });
    window.addEventListener('pagehide', close);
    window.StandalonePhotoFlow = { open, close };
})();
