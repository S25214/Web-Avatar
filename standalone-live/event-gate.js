/* Entry check for QR event visits. The shared live.html page is untouched. */
(() => {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    const parameter = params.has('client_api_key') ? 'client_api_key' : params.has('event_key') ? 'event_key' : null;
    if (!parameter) return;

    const key = (params.get(parameter) || '').trim();
    const API_BASE = 'https://botnoi-image.didthat.workers.dev';
    let authorize;
    const ready = new Promise(resolve => { authorize = resolve; });
    let checking = false;

    document.documentElement.dataset.eventGate = 'checking';
    window.StandaloneGenerationConfig = {
        ...window.StandaloneGenerationConfig,
        clientApiKey: key
    };
    window.StandaloneEventGate = { ready };

    function show(state) {
        const screen = document.getElementById('event-gate');
        const title = document.getElementById('event-gate-title');
        const message = document.getElementById('event-gate-message');
        const retry = document.getElementById('event-gate-retry');
        if (!screen || !title || !message || !retry) return;

        screen.hidden = false;
        document.documentElement.dataset.eventGate = state;
        retry.hidden = state !== 'error';
        if (state === 'checking') {
            title.textContent = 'กำลังตรวจสอบสิทธิ์เข้างาน';
            message.textContent = 'โปรดรอสักครู่';
        } else if (state === 'ended') {
            title.textContent = 'กิจกรรมนี้สิ้นสุดแล้ว';
            message.textContent = 'ขอบคุณที่สนใจ แล้วพบกันใหม่ในกิจกรรมครั้งหน้า';
        } else if (state === 'error') {
            title.textContent = 'ยังตรวจสอบสิทธิ์ไม่ได้';
            message.textContent = 'การเชื่อมต่อขัดข้องชั่วคราว กรุณาลองอีกครั้ง';
        }
    }

    async function verify() {
        if (checking) return;
        checking = true;
        show('checking');
        if (!key) {
            show('ended');
            checking = false;
            return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
            const response = await fetch(`${API_BASE}/api/generations?page=1&limit=1`, {
                headers: { 'X-API-Key': key },
                cache: 'no-store',
                credentials: 'omit',
                signal: controller.signal
            });
            if (response.ok) {
                document.getElementById('event-gate').hidden = true;
                delete document.documentElement.dataset.eventGate;
                authorize(true);
            } else if (response.status === 401 || response.status === 403) {
                show('ended');
            } else {
                show('error');
            }
        } catch {
            show('error');
        } finally {
            clearTimeout(timeout);
            checking = false;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('event-gate-retry').addEventListener('click', verify);
        verify();
    }, { once: true });
})();
