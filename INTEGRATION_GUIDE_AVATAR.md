# WebAvatar Avatar Widget Integration Guide (AI-Ready)

This guide covers the integration of `avatar-widget.js`. This widget provides a standalone 3D VRM avatar overlay with real-time lip-sync, animations, and an emotion system.

---

## 1. Quick Start

### Include the Script

Paste the universal loader into your HTML before `</body>`:

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

For **React/Vue/Angular/Svelte**, paste the JavaScript body into your component's mount lifecycle (`useEffect`, `onMounted`, `ngAfterViewInit`, `onMount`) — the code is identical, no translation needed.

### Initialize
Initialize the avatar using the global `window.WebAvatar` object:

```js
window.WebAvatar.init({
    modelUrl: 'Botnoi',
    defaultAnimationUrl: 'Idleloop',
    position: 'bottom-right'
});
```

---

## 2. Configuration Options

Pass these in the `init({ ... })` object:

| Option | Type | Default | Description |
|---|---|---|---|
| `modelUrl` | String | `'Kitagawa'` | Manifest name (e.g., `'Botnoi'`) or full `.vrm` URL. |
| `defaultAnimationUrl` | String\|Array | `['Idleloop', ...]` | Idle animation(s) to loop. Can also be a comma-separated String. |
| `animationUrl` | String | `'Greeting'` | Initial animation to play on load. |
| `position` | String | `'bottom-right'` | `'bottom-right'`, `'bottom-left'`, `'center'`, etc. |
| `offset` | Object | `{ x: 0, y: 0 }` | Pixel offset from the anchor point. |
| `cameraTarget` | Object | `{ x: 0, y: 0, z: 0 }` | Camera focus offset relative to the avatar. |
| `randomGeneric` | Boolean | `true` | Randomly plays 'Generic' animations during idle. |
| `randomIntervalMin` | Number | `15` | Min seconds between random behaviors. |
| `container` | String\|HTMLElement | — | Optional. Selector string or direct DOM element. If provided, the widget will render absolutely inside this element instead of dynamically appending to `document.body` with fixed viewport positioning. |

---

## 3. API Methods — `window.WebAvatar`

### Core
- `WebAvatar.init(options)`: Initializes the widget.
- `WebAvatar.loadModel(url)`: Switches to a different VRM model.
- `WebAvatar.loadAnimation(url)`: Plays a specific animation with smooth crossfade.
- `WebAvatar.setEmotion(name, duration?)`: Sets emotion: `happy`, `sad`, `angry`, `surprised`, `relaxed`, `idle`.
- `WebAvatar.disconnect()`: Unloads the widget and cleans up resources.

### Audio & Lip-Sync
- `WebAvatar.playAudio(source)`: Plays one-shot audio (URL or Base64) with lip-sync.
- `WebAvatar.pushAudioChunk(chunk, options?)`: Streaming audio (PCM/MP3/WAV) with real-time lip-sync.
- `WebAvatar.endAudio()`: Flushes the streaming audio buffer.
- `WebAvatar.playStream(mediaStream)`: Connects a `MediaStream` (e.g., WebRTC) for live lip-sync.
- `WebAvatar.stopAudio()`: Immediately stops all playback.

### State & Utilities
- `WebAvatar.setVolume(0-1)`: Sets audio volume.
- `WebAvatar.setCameraPosition(x, y, z)`: Adjusts camera offset.
- `WebAvatar.getModels()`: (Async) Returns list of available models.
- `WebAvatar.getAnimations()`: (Async) Returns list of available animations.
- `WebAvatar.getEmotions()`: Returns list of available emotions.

---

## 4. Multi-Instance & Timeline Modes

### Multi-Instance Instantiation
Instead of the `window.WebAvatar` singleton, you can instantiate multiple independent widgets on the same page:

```js
const avatar = new window.AvatarWidget({
    modelUrl: 'Botnoi',
    container: '#avatar-container-1',
    timelineMode: true,
    editMode: true // Enable drag/resize (default: true)
});
await avatar.init();
```

### Drag-and-Resize Focused Overlay
When initialized in `timelineMode: true` with `editMode: true` (default), clicking inside the avatar container focuses it and displays a dashed border outline with 4 small circular corner resize handles. Click anywhere else to blur (deselect) it.

To disable drag/resize interactions and make the avatar pass through mouse/touch events:
```js
avatar.setEditMode(false); // Disables drag/resize, makes container non-interactive
avatar.setEditMode(true);  // Re-enables drag/resize
```
* **Parent Boundary Lock**: Dragging and resizing are constrained to prevent the widget from moving or sizing outside the boundaries of its parent container.
* **Proportional Scaling**: Changes are calculated and stored in parent-relative percentage values (`%`), so the layout scales dynamically and repositions correctly when the container element resizes.
* **Auto-Persistence**: Layout positions and camera offsets are automatically saved to browser `localStorage` per timeline configuration. Each unique timeline config maintains its own saved layout and camera settings.
* **Camera Adjustment Overlay**: A set of non-intrusive camera controls is rendered when focused:
  - Position arrows (`▲`, `▼`, `◀`, `▶`) sit in a clean floating column at the bottom-right corner of the frame to shift the camera focus.
  - Zoom (`+`, `-`) and Reset (`●`) buttons sit in a clean floating column at the bottom-left corner of the frame.
* Listen to position/dimension changes (fires only on mouseup/touchend):
```js
avatar.container.addEventListener('layout-changed', (e) => {
    console.log("New coordinates:", e.detail); // e.g. { width: "25.00%", height: "40.00%", x: "70.00%", y: "50.00%" }
});
```

### Loading & Controlling Timelines
Timeline configurations contain audio/video tracks and animation/emotion triggers. If a video URL is passed, the widget decodes the audio track natively.

**Auto-Duration Calculation:** The widget automatically detects the duration of each audio/video track and calculates the total timeline duration based on the longest track end time. Animation and emotion triggers that extend past this calculated duration will be clipped. If no media tracks are provided, the timeline defaults to 10 seconds.

**Important:** You only need to specify the `start` time for each audio/video track. The widget will automatically detect each clip's duration. You can optionally provide `duration` to override the auto-detected value.

```js
const timelineConfig = {
    muteAudio: true, // Set to true to let the video player handle audio output
    layout: { width: "30%", height: "50%", x: "35%", y: "25%" }, // Optional: initial position (defaults if omitted)
    cameraOffset: { x: 0, y: -0.15, z: -3.5 }, // Optional: initial camera position
    audio: [
        { url: "/videos/my-video.mp4", start: 0 } // duration auto-detected
    ],
    triggers: [
        { id: "t1", type: "animation", name: "Greeting", start: 0.5, duration: 3.5, loop: false },
        { id: "t2", type: "emotion", name: "happy", start: 1.0, duration: 4.0 },
        { id: "t3", type: "animation", name: "Talk", start: 5.0 } // Omitted duration resolves to full clip duration
    ]
    // timeline duration is auto-calculated from detected media durations
};
```

* **Timeline Animation Looping Rules**:
  * In timeline mode, animations loop by default throughout the duration of their trigger block.
  * If a trigger block specifies `{ loop: false }`, the animation plays only once (clamping on its last frame) when triggered.
  * Animations with "loop" in their filename (e.g. `Idleloop`) will *always* loop, overriding any custom `{ loop: false }` trigger option.
  * **Optional Durations**: The `duration` field is optional for animation triggers. If omitted, the widget dynamically looks up the cached clip's duration and sets the trigger's duration to play the clip fully.

* **Developer Sandbox**: Refer to `https://webavatar-didthat.cc/timeline-demo.html` or `https://webavatar-didthat.cc/timeline-demo-simple.html` for example reference sandbox.

```js
// Loads, checks IndexedDB cache (fast path), or decodes/precomputes (slow path)
await avatar.loadTimeline(timelineConfig);

// Control playback
avatar.playTimeline();
avatar.pauseTimeline();
avatar.setTimelineTime(15.5); // Seek playhead snappy (crossfades disabled)
```

### Video Sync Helper
Sync the avatar playhead, play/pause, seeks, and speed rates in perfect lockstep with an HTML5 video player:

```js
const video = document.querySelector('video');
avatar.syncWithVideoPlayer(video);

// To release listeners later:
avatar.unsyncVideoPlayer();
```

### Error Handling

The widget validates timeline configurations before loading. If validation fails, a `timeline-validation-error` event is fired on the avatar container with detailed error information:

```js
avatar.container.addEventListener('timeline-validation-error', (e) => {
    const errors = e.detail.errors;
    errors.forEach(err => {
        console.error(`[${err.code}] ${err.message}`);
        console.error(`  Path: ${err.path}`);
        if (err.hint) console.log(`  💡 ${err.hint}`);
    });
});
```

**Error Structure**: Each error contains:
- `code`: Machine-readable error code (e.g., `INVALID_TRIGGER_TYPE`)
- `message`: Human-readable description
- `path`: JSON path to the error location (e.g., `triggers[0].type`)
- `hint`: Actionable suggestion for fixing the issue

**Common Validation Errors**:
- `INVALID_CONFIG`: Timeline config must be an object
- `INVALID_AUDIO_ARRAY`: audio must be an array
- `INVALID_TRIGGERS_ARRAY`: triggers must be an array
- `INVALID_TRIGGER_TYPE`: trigger type must be "animation" or "emotion"
- `INVALID_EMOTION_NAME`: Unknown emotion name
- `MISSING_ANIMATION_NAME`: Animation trigger missing required "name" field

The sandbox demo (timeline-sandbox.html) displays validation errors using a browser alert with all error details formatted inline.

---


## 5. Technical Features
- **Lip-Sync**: Real-time MFCC phoneme detection (aa, ih, ou, ee, oh).
- **Timeline precomputation**: IndexedDB caching of baked lipsync phoneme structures for instantaneous subsequent loads.
- **Animations**: VRMA support with root-motion compensation and smooth blending.
- **Emotions**: 6 core states with spring-damper smoothing.
- **Behaviors**: Deterministic eye-blinking is baked and cached directly with the offline lipsync frame data, pausing/seeking in sync with the playback timeline, and custom camera adjustments.
- **Dependencies**: Automatically handles Three.js and Pixiv VRM (no manual script tags needed).

### Caching Behavior

The widget uses multiple caching layers:

1. **Lipsync frames** (IndexedDB) — Timeline configurations are automatically hashed, and precomputed phoneme + blink frames are stored in IndexedDB. Subsequent loads of the same timeline are instant (no re-analysis). This is handled transparently by the widget.

2. **Animation clips (.vrma files)** — Cached in-memory only during the page session. Cleared on page reload.

**Note**: Developers can store timeline configs in their own localStorage/database layer for persistence across sessions. See `timeline-sandbox.html` for a reference implementation using localStorage.
