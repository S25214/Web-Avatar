/* Page-local voice affordances: ordinary DOM actions for existing navigation tools. */
(() => {
    'use strict';
    const $ = id => document.getElementById(id);
    let preparing = false;

    async function takeTimedPhoto(seconds) {
        if (preparing || ![3, 5, 10].includes(seconds) || window.StandaloneGeneration?.isBusy()) return;
        if ($('camera-dialog').open && ($('camera-capture-btn').disabled || cameraTimer !== null)) return;
        preparing = true;
        try {
            window.openCameraDialog();
            const request = cameraRequest;
            const deadline = Date.now() + 20000;
            while ($('camera-dialog').open && request === cameraRequest && $('camera-capture-btn').disabled) {
                if (Date.now() >= deadline) return; // Never take a delayed, unexpected photo after a permission wait.
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            if (!$('camera-dialog').open || request !== cameraRequest || $('camera-capture-btn').disabled) return;
            $('camera-timer-duration').value = String(seconds);
            window.updateCameraTimerLabel();
            window.startCameraTimer(seconds);
        } finally {
            preparing = false;
        }
    }

    window.StandaloneVoice = { takePhoto: takeTimedPhoto };
})();
