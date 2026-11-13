# WebAvatar Avatar Widget Integration Guide (AI-Ready)

`avatar-widget.js` is a standalone 3D VRM avatar overlay with lip-sync, animations and emotions. Three.js and three-vrm are bundled; no other script tags are needed.

> **Don't read `avatar-widget.js` directly.** It is a minified, obfuscated build, so it can't tell you how the widget works. Use this guide.

## 1. Quick Start

Add before `</body>` (in React/Vue/Angular/Svelte, run the same code in the mount hook):

```html
<script>
    (function() {
        if (document.getElementById('webavatar-avatar-jssdk')) return;
        var s = document.createElement('script');
        s.id = 'webavatar-avatar-jssdk';
        s.src = 'https://webavatar.didthat.cc/avatar-widget.js';
        s.async = true;
        (document.head || document.body).appendChild(s);
    })();
</script>
```

Then, once the script has loaded:

```js
const result = await window.WebAvatar.init({ modelUrl: 'Botnoi', position: 'bottom-right' });
if (!result.ok) console.warn('Avatar failed to load', result.attempts);
```

`init()` never throws. It resolves to `{ ok, source, context, attempts }`; on failure `ok` is `false` and the page keeps working. The avatar is click-through, so page controls behind it stay usable.

## 2. Options (`init({...})`)

| Option | Default | Description |
|---|---|---|
| `modelUrl` | catalog default preset | Preset name (`'Botnoi'`) or a full `.vrm` URL. |
| `avatarCandidates` | — | Models to try in order, e.g. `[{ id: 'Botnoi' }, { url: 'https://…/a.vrm' }]`. The catalog default is always tried last. |
| `widgetId` | — | Loads the catalog for that widget (includes its account-only presets). |
| `defaultAnimationUrl` | catalog defaults, else `['Idleloop', 'idle_breatheloop']` | Idle animation(s): string, comma-separated string or array. With several, the widget switches between them. |
| `animationUrl` | `'Greeting'` | Animation played once on load. |
| `position` | `'bottom-right'` | `bottom-right`, `bottom-left`, `bottom-center`, `top-right`, `top-left`, `top-center`, `center`. |
| `offset` | `{ x: 0, y: 0 }` | Pixel offset added to the position. |
| `container` | — | Selector or element to render inside (absolute) instead of a fixed overlay on `body`. |
| `cameraTarget` | `{ x: 0, y: 0, z: 0 }` | Camera offset. |
| `randomGeneric` | `false` | Plays random "Generic" animations while idle. |
| `randomIntervalMin` / `randomIntervalMax` | `15` / `30` | Seconds between idle behaviours. |
| `zIndex` | `9999` | Overlay z-index. |
| `showGrid` | `false` | Floor grid. |
| `maxPixelRatio` | `2` | Caps render resolution (lower = cheaper). |
| `manifestUrl` | public catalog | Asset catalog override (also `window.WebAvatarConfig.manifestUrl`). |

## 3. API — `window.WebAvatar`

**Lifecycle**
- `init(options)` → `Promise<{ ok, source, context, attempts }>`; a second call returns the first promise.
- `setPaused(bool)`: stop/resume rendering (e.g. while the avatar is hidden).
- `disconnect()` / `destroy()`: remove the widget and free resources.

**Model, animation, emotion**
- `loadModel(urlOrPreset)` → `Promise<{ ok, … }>`.
- `loadAnimation(idOrUrl)`: crossfades to a catalog ID (`'Greeting'`) or a `.vrma`/`.glb`/`.gltf` URL. `preloadAnimation(id)` warms the cache.
- `setEmotion(name, seconds?)`: `happy`, `sad`, `angry`, `surprised`, `relaxed`, `idle` (case-insensitive; `seconds` omitted = until changed).
- `setCameraPosition(x, y, z, immediate?)`, `setVolume(0–1)`.
- `getModels()`, `getAnimations()` (async, from the catalog).

**Audio and lip-sync**
- `prepareAudio()`: call from a user gesture (e.g. the call button) before audio arrives, so autoplay rules don't block it.
- `playAudio(urlOrBase64)`: one-shot playback with lip-sync.
- `pushAudioChunk(chunk, options?)` + `endAudio()`: streamed PCM/MP3/WAV with lip-sync. `hasPendingAudio()` tells whether any is still queued.
- `playStream(mediaStream)`: lip-sync a live `MediaStream` (WebRTC).
- `stopAudio()`: stop everything now.
- Lip-sync without playback (someone else plays the audio): `pushLipSyncChunk(pcm, { sampleRate })` or `applyLipSyncFrame(frame, { holdMs })`, then `endLipSync()`.
- `getAudioContext()`: the avatar's `AudioContext`; capture the mic in it so echo cancellation sees the avatar's voice.

**Events**
- `window`: `avatar-widget-ready` (detail = init result), `webavatar-audio-ended`, `avatar-model-load-success` / `avatar-model-load-failure`.
- widget container: the model events above, plus `avatar-animation-load-success` / `avatar-animation-load-failure`.

## 4. Multiple Avatars and Timeline Mode

`new window.AvatarWidget(options)` creates an independent avatar (same options as `init`, plus `timelineMode` and `editMode`):

```js
const avatar = new window.AvatarWidget({ modelUrl: 'Botnoi', container: '#stage', timelineMode: true });
await avatar.init();
```

### Edit mode (timeline only)
With `timelineMode: true` and `editMode: true` (default), clicking the avatar selects it: drag to move, corner handles to resize, on-frame buttons to move/zoom/reset the camera. Layout is stored in parent-relative `%`, kept inside the parent, and saved to `localStorage` per timeline. `avatar.setEditMode(false)` makes it click-through.

Events on `avatar.container`: `layout-changed` (on mouse/touch release, detail `{ width, height, x, y }` in `%`), `avatar-focused`, `avatar-blurred`. `avatar.applyLayout({ width, height, x, y })` sets it from code.

### Timeline config

```js
await avatar.loadTimeline({
    muteAudio: true,                       // let your <video> play the sound
    defaultAnimation: 'Idleloop',          // between animation triggers
    layout: { width: '30%', height: '50%', x: '35%', y: '25%' },   // optional
    cameraOffset: { x: 0, y: -0.15, z: -3.5 },                     // optional
    audio: [
        { url: '/videos/clip.mp4', start: 0 }   // optional: duration, trimStart, speed
    ],
    triggers: [
        { id: 't1', type: 'animation', name: 'Greeting', start: 0.5, duration: 3.5, loop: false },
        { id: 't2', type: 'emotion', name: 'happy', start: 1.0, duration: 4.0 },
        { id: 't3', type: 'animation', name: 'Talk', start: 5.0 }  // no duration = whole clip
    ]
});
avatar.playTimeline(); avatar.pauseTimeline(); avatar.setTimelineTime(15.5);
avatar.syncWithVideoPlayer(document.querySelector('video'));   // follows play/pause/seek/rate; unsyncVideoPlayer() to stop
```

Rules:
- Only `start` is required on audio/video clips; durations are detected (video files are decoded for their audio). Total length = end of the longest clip (10 s with no media); triggers past it are cut.
- Animations loop for their whole trigger block unless `loop: false` (plays once, holds the last frame). Names containing `loop` (e.g. `Idleloop`) always loop.
- When triggers overlap, the one that started last wins.
- Lip-sync and blink frames are precomputed once and cached in IndexedDB by config hash, so reloading the same timeline is instant. `WebAvatar.clearCache()` empties it.
- Container events: `timeline-loaded`, `timeline-played`, `timeline-paused`, `timeline-seeked`.

### Validation errors
An invalid config makes `loadTimeline()` reject (`error.code === 'VALIDATION_FAILED'`, list in `error.validationErrors`) and fires `timeline-validation-error` on the container with `detail.errors`. Each error has `code`, `message`, `path` (e.g. `triggers[0].type`) and `hint`. Common codes: `INVALID_CONFIG`, `INVALID_AUDIO_ARRAY`, `MISSING_AUDIO_URL`, `MISSING_START_TIME`, `INVALID_TRIGGERS_ARRAY`, `INVALID_TRIGGER_TYPE` (must be `animation` or `emotion`), `MISSING_TRIGGER_NAME`, `INVALID_DURATION`, `INVALID_SPEED`, `INVALID_TRIM_START`, `INVALID_LOOP`, `INVALID_MUTE_AUDIO`, `INVALID_DEFAULT_ANIMATION`. A missing animation rejects with `ANIMATION_PRELOAD_ERROR`.

Working examples: `https://webavatar.didthat.cc/timeline-demo.html` and `https://webavatar.didthat.cc/timeline-demo-simple.html`.

## 5. Asset Catalog

Models and animations come from the R2 catalog (`https://webavatar-avatar-assets.didthat.workers.dev/v1/manifest`, optionally `?widgetId=`). Use its stable IDs (`'Botnoi'`, `'Greeting'`) rather than building file paths; each animation ID picks a model-specific file when one exists, else the common one. Full URLs still work.

Inside `chat-widget` you don't call this yourself: one `widget-config?widgetId=…` request returns the widget's avatar and the catalog it may use (including account-only presets for the owner's widgets). Generated avatars load from the per-user avatar API and use their saved profile for animations.
