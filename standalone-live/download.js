/* Public QR download page: image links only, no API credentials. */
(() => {
    'use strict';
    const params = new URLSearchParams(window.location.search);
    const image = document.getElementById('photo');
    const button = document.getElementById('download');
    const original = document.getElementById('original');
    const status = document.getElementById('status');
    const objectUrls = new Set();
    let url;
    try {
        url = new URL(params.get('image') || '');
        if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid image URL');
    } catch {
        status.textContent = 'This photo link is invalid. Scan the QR code on your generated image again.';
        return;
    }
    original.href = url.href;
    original.hidden = false;
    image.referrerPolicy = 'no-referrer';
    image.onload = () => { status.textContent = 'Your photo is ready to save.'; };
    image.onerror = () => { status.textContent = 'The preview could not load. Use Open original to view your photo.'; };
    image.src = url.href;
    image.hidden = false;
    button.disabled = false;
    const id = (params.get('id') || 'generated-photo').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || 'generated-photo';
    const extension = /\.(png|jpe?g|webp)$/i.exec(url.pathname)?.[1] || 'png';

    button.addEventListener('click', async () => {
        button.disabled = true;
        status.textContent = 'Preparing your download…';
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        try {
            const response = await fetch(url.href, { credentials: 'omit', referrerPolicy: 'no-referrer', signal: controller.signal });
            if (!response.ok) throw new Error('Download unavailable');
            const blob = await response.blob();
            if (!blob.size) throw new Error('Empty image');
            const objectUrl = URL.createObjectURL(blob);
            objectUrls.add(objectUrl);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = `${id}.${extension}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            status.textContent = 'Your download has started. Check your device’s downloads.';
            setTimeout(() => { URL.revokeObjectURL(objectUrl); objectUrls.delete(objectUrl); }, 60000);
        } catch {
            status.textContent = 'Direct download is unavailable. Tap Open original, then use your browser’s Save Image option.';
        } finally {
            clearTimeout(timeout);
            button.disabled = false;
        }
    });
    window.addEventListener('pagehide', () => { for (const objectUrl of objectUrls) URL.revokeObjectURL(objectUrl); objectUrls.clear(); });
})();
