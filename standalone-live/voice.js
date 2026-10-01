/* Page-local voice affordances: ordinary DOM actions for existing navigation tools. */
(() => {
    'use strict';
    function takeTimedPhoto(seconds = 10) {
        seconds = Number(seconds);
        if (![0, 3, 5, 10].includes(seconds) || window.StandaloneGeneration?.isBusy()) return;
        if (document.getElementById('camera-dialog').open) window.setCameraCountdown(seconds);
        else window.openCameraDialog(seconds);
    }

    function notifyChat(message) {
        try {
            Promise.resolve(window.ChatWidget?.sendUserMessage?.(message))
                .catch(error => console.warn('[StandaloneVoice] Could not notify chat:', error));
        } catch (error) {
            console.warn('[StandaloneVoice] Could not notify chat:', error);
        }
    }

    window.StandaloneVoice = { takePhoto: takeTimedPhoto, notifyChat };
})();
