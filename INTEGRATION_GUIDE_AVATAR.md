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

---

## 4. Assets & Folder Structure

For auto-discovery, organize your server relative to `avatar-widget.js`:

```text
/
├── avatar-widget.js
├── manifest.json (Optional: lists models/anims)
├── VRM/
│   ├── Botnoi.vrm
│   └── ...
└── VRMA/
    ├── Idleloop.vrma
    └── ...
```

---

## 5. Technical Features
- **Lip-Sync**: Real-time MFCC phoneme detection (aa, ih, ou, ee, oh).
- **Animations**: VRMA support with root-motion compensation and smooth blending.
- **Emotions**: 6 core states with spring-damper smoothing.
- **Behaviors**: Auto-blinking and randomized idle state switching.
- **Dependencies**: Automatically handles Three.js and Pixiv VRM (no manual script tags needed).
