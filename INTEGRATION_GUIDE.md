# WebAvatar Chat Widget — Integration Guide

> **Audience**: External developers embedding the chat widget into a website.
> This document covers everything needed to install, configure, and interact with the widget via its public JavaScript API. No source code access is required.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Configuration Sources](#configuration-sources)
3. [Provider Modes](#provider-modes)
4. [Configuration Reference](#configuration-reference)
5. [JavaScript API — `window.ChatWidget`](#javascript-api--windowchatwidget)
6. [Avatar Widget API — `window.WebAvatar`](#avatar-widget-api--windowwebavatar)
7. [Common Integration Patterns](#common-integration-patterns)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

Paste the universal embed snippet before `</body>`. It works on **any framework**: plain HTML, React, Vue, Angular, Next.js, Svelte — no translation needed.

### Botnoi Provider (managed backend)

```html
<script>
    window.ChatWidgetConfig = {
        botId: "YOUR_BOT_ID",
        bnvVersion: "1",
        bnvSpeaker: "13",
        avatarUrl: "Botnoi"
    };
    (function() {
        if (document.getElementById('webavatar-jssdk')) return;
        var s = document.createElement('script');
        s.id = 'webavatar-jssdk';
        s.src = 'https://webavatar.didthat.cc/chat-widget.js';
        s.async = true;
        (document.head || document.body).appendChild(s);
    })();
</script>
```

The widget connects to the Botnoi chatbot backend, handles TTS, ASR, animations, and avatar lip-sync automatically.

### Custom Provider (bring your own backend)

```html
<script>
    window.ChatWidgetConfig = {
        provider: "custom",
        widgetId: "your-widget-id",
        title: "My Assistant",
        avatarUrl: "Botnoi"
    };
    (function() {
        if (document.getElementById('webavatar-jssdk')) return;
        var s = document.createElement('script');
        s.id = 'webavatar-jssdk';
        s.src = 'https://webavatar.didthat.cc/chat-widget.js';
        s.async = true;
        (document.head || document.body).appendChild(s);
    })();
</script>
```

In custom mode, **no backend is loaded**. You control all messaging, audio, and animation through the `window.ChatWidget` JavaScript API.

### Framework Usage (React, Vue, Angular, Svelte)

The JavaScript inside the `<script>` tag above is **identical** to what you'd use in any framework's mount lifecycle — just paste the code body:

```js
// React: useEffect(() => { ... }, [])
// Vue:   onMounted(() => { ... })
// Angular: ngAfterViewInit() { ... }
// Svelte: onMount(() => { ... })

window.ChatWidgetConfig = {
    botId: "YOUR_BOT_ID",
    avatarUrl: "Botnoi"
};
if (!document.getElementById('webavatar-jssdk')) {
    var s = document.createElement('script');
    s.id = 'webavatar-jssdk';
    s.src = 'https://webavatar.didthat.cc/chat-widget.js';
    s.async = true;
    (document.head || document.body).appendChild(s);
}
```

---

## Configuration Sources

The widget resolves configuration from **three sources**, checked in this priority order:

| Priority | Source | Best For |
|---|---|---|
| 1 | `data-*` attributes on the `<script>` tag | Simple HTML pages (legacy) |
| 2 | `data-*` attributes on a container `<div class="bn-customerchat">` | CMS embeds |
| 3 | `window.ChatWidgetConfig` JS object | **All frameworks (recommended)** |

The **`window.ChatWidgetConfig`** approach (Priority 3) is the **recommended universal method** because:
- It doesn't rely on `document.currentScript` (which fails in async/bundled contexts like React, Next.js, Webpack, etc.)
- It works identically in every framework
- The config is a plain JavaScript object — easy to set dynamically

> **Note**: If both `data-*` attributes and `ChatWidgetConfig` are present, `data-*` attributes take precedence for any key that appears in both.

---

## Provider Modes

The widget supports two mutually exclusive provider modes, determined at load time.

### Botnoi Provider (`provider: "botnoi"` or `botId` is present)

- **Fully managed**: connects to Botnoi chatbot platform realtime messaging.
- **Built-in TTS**: generates voice from bot responses using Botnoi Voice API.
- **Built-in ASR**: microphone button records audio → sends to Botnoi ASR endpoint → auto-fills user message.
- **Auto-animation**: AI selects contextual avatar animations based on conversation content.
- **Setup form**: if `botId` is not provided, a setup form is shown inside the panel for the user to enter credentials.

### Custom Provider (`provider: "custom"` or no `botId`)

- **No backend loaded**: TTS and ASR are not initialized.
- **You handle everything**: listen for user messages via `ChatWidget.onUserMessage()`, generate your own responses, and inject them via `ChatWidget.addBotMessage()`.
- **Optional avatar**: the 3D avatar still loads and can be controlled via `ChatWidget.playAudio()`.
- **Optional mic**: register your own ASR logic via `ChatWidget.onMicToggle()` and `ChatWidget.onMicChunk()`.

### Provider Detection Logic

The provider is resolved in this order:

1. If `provider` is `"custom"` → **Custom mode**
2. If `provider` is any other value → **Botnoi mode**
3. If `provider` is not set but `botId` is present → **Botnoi mode**
4. If neither `provider` nor `botId` is set → **Custom mode**

---

## Configuration Reference

All configuration keys below can be set via `window.ChatWidgetConfig` (camelCase) or as `data-*` attributes (kebab-case).

### Universal Options (both providers)

| ChatWidgetConfig Key | data-* Attribute | Type | Default | Description |
|---|---|---|---|---|
| `provider` | `data-provider` | `"custom"` \| `"botnoi"` | Auto-detected | Explicitly set the provider mode. |
| `title` | `data-title` | `string` | `"Botnoi Assistant"` | Text shown in the chat panel header. |
| `avatarUrl` | `data-avatar-url` | `string` | `"Botnoi"` | VRM model name (from the built-in model list) or a full URL to a `.vrm` file. |
| `avatar` | `data-avatar` | `"true"` \| `"false"` | `"true"` | Set to `"false"` to disable the 3D avatar entirely. |
| `persistHistory` | `data-persist-history` | `"true"` \| `"false"` | `"true"` | Persist chat history in `localStorage` across page reloads. |
| `autoFocusInput` | `data-auto-focus-input` | `"true"` \| `"false"` | `"false"` | Auto-focus the text input when the chat panel opens. |
| `color` | `data-color` | `string` | — | Theme color hex, e.g. `"#a7e6ff"`. |
| `defaultAnimationUrl` | `data-default-animation-url` | `string` | — | Idle animation(s) to loop. Can be a single animation name or a comma-separated list of names. |
| `animationUrl` | `data-animation-url` | `string` | — | Initial animation to play on load. |
| `container` | `data-container` | `string` \| `HTMLElement` | — | Optional. Selector string or direct DOM element. When specified, forces the widget, controls, and canvas to render absolutely inside this parent element instead of overlaying the document viewport/body. |

### Custom Provider Options

| ChatWidgetConfig Key | data-* Attribute | Type | Default | Description |
|---|---|---|---|---|
| `widgetId` | `data-widget-id` | `string` | `""` | Widget ID for animation API authentication. Required for auto-animation in custom mode. |
| `micLimit` | `data-mic-limit` | `number` (seconds) | `0` (unlimited) | Maximum microphone recording duration. `0` means no limit. |

### Botnoi Provider Options

| ChatWidgetConfig Key | data-* Attribute | Type | Default | Description |
|---|---|---|---|---|
| `botId` | `data-bot-id` | `string` | `""` | Your Botnoi chatbot ID. |
| `bnvVersion` | `data-bnv-version` | `"1"` \| `"2"` | `"1"` | Botnoi Voice API version for TTS. |
| `bnvSpeaker` | `data-bnv-speaker` | `string` | `"13"` | Botnoi Voice speaker ID for TTS. |

> **Note**: In Botnoi mode, `micLimit` is always forced to `10` seconds regardless of any configured value.

---

## JavaScript API — `window.ChatWidget`

After the script loads, a global `window.ChatWidget` object is available with the following methods. All methods work in both provider modes unless noted.

### Messages

#### `ChatWidget.addBotMessage(text, options?)`

Display a bot message bubble in the chat panel.

| Parameter | Type | Description |
|---|---|---|
| `text` | `string` | The message text to display. |
| `options.audio` | `string` (URL or base64) | Optional. Play audio after displaying the message. Routes through avatar for lip-sync if available. |
| `options.animation` | `string` | Optional. Play a named avatar animation (e.g. `"Greeting"`, `"Thinking"`). |
| `options.anim` | `boolean` | Optional. Set to `false` to suppress the default auto-animation for this message. Default: `true`. |

```js
// Simple text message
ChatWidget.addBotMessage("Hello! How can I help you?");

// With a specific animation
ChatWidget.addBotMessage("Welcome!", { animation: "Greeting" });

// With TTS audio
ChatWidget.addBotMessage("สวัสดีค่ะ", { audio: "https://example.com/greeting.mp3" });

// Suppress auto-animation
ChatWidget.addBotMessage("Processing...", { anim: false });
```

#### `ChatWidget.addUserMessage(text)`

Programmatically inject a user message bubble and fire all `onUserMessage` callbacks.

```js
ChatWidget.addUserMessage("What is the weather today?");
```

#### `ChatWidget.onUserMessage(callback)`

Register a callback that fires whenever the user sends a message (via text input, enter key, or `addUserMessage()`).

```js
ChatWidget.onUserMessage(function(text) {
    console.log("User said:", text);

    // Send to your backend, get response, then:
    fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: text }),
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
        ChatWidget.addBotMessage(data.reply);
    });
});
```

> **Multiple callbacks**: You can call `onUserMessage()` multiple times. All registered callbacks will fire.

---

### Audio / TTS

#### `ChatWidget.playAudio(source)`

Play audio from a URL, base64 string, or data URI. If the avatar is loaded, audio routes through `WebAvatar.playAudio()` for lip-sync.

```js
ChatWidget.playAudio("https://example.com/response.mp3");
ChatWidget.playAudio("data:audio/wav;base64,UklGRi...");
```

#### `ChatWidget.pushAudioChunk(chunk, options?)`

Push an audio chunk for buffered streaming playback. Ideal for streaming TTS responses from any cloud provider. Routes through the avatar for real-time lip-sync when available.

The streaming engine supports four input paths:

1. **Self-decodable encoded chunks** (MP3 frames, OGG/Opus pages): Each chunk decodes immediately for low-latency playback. This is the most common path for cloud TTS services like ElevenLabs, OpenAI, and most streaming APIs.
2. **WAV streams**: The engine detects WAV headers in the first chunk and automatically processes subsequent chunks as raw PCM for zero-decode-overhead streaming.
3. **Non-self-decodable chunks** (partial MP3 frames): The engine automatically accumulates data until enough is present for a successful decode — no caller-side buffering needed.
4. **Raw PCM data** (`options.pcm: true`): Bypasses decoding entirely and creates audio buffers directly. Use for Google Cloud TTS LINEAR16 output, Azure raw PCM, or microphone streams.

All chunks are serialized internally to guarantee correct playback order, even when decoding is asynchronous.

| Parameter | Type | Description |
|---|---|---|
| `chunk` | `ArrayBuffer` \| `Uint8Array` \| `string` | Encoded audio data (MP3, OGG, WAV, etc.), raw PCM, or a base64-encoded string. |
| `options.pcm` | `boolean` | Set to `true` if the chunk is raw PCM data. |
| `options.sampleRate` | `number` | Sample rate of PCM data (default: `24000`). Common values: `16000`, `22050`, `24000`, `44100`, `48000`. |
| `options.channels` | `number` | Number of audio channels (default: `1`). |
| `options.bitDepth` | `number` | Bit depth of PCM data: `16` (Int16) or `32` (Float32). Default: `16`. |

```js
// Streaming encoded MP3 chunks (ElevenLabs, OpenAI, etc.)
ChatWidget.pushAudioChunk(mp3ChunkArrayBuffer);

// Streaming raw PCM from a WebSocket (Google Cloud TTS, Azure)
ChatWidget.pushAudioChunk(pcmInt16Buffer, {
    pcm: true,
    sampleRate: 24000,
    channels: 1,
    bitDepth: 16
});

// Streaming raw Float32 from AudioWorklet or microphone
ChatWidget.pushAudioChunk(float32Buffer, {
    pcm: true,
    sampleRate: 48000,
    channels: 1,
    bitDepth: 32
});

// Base64-encoded audio chunk (common in WebSocket JSON messages)
ChatWidget.pushAudioChunk(base64AudioString);
```

> **Format compatibility**: MP3 and OGG/Opus streams work well because each frame/page is self-decodable. WAV streaming and raw PCM (`pcm: true`) provide the lowest possible latency due to zero decode overhead.

#### `ChatWidget.endAudio()`

Signal that streaming audio is complete. **Always call this** after the last `pushAudioChunk()` — it flushes any remaining buffered data and ensures the audio plays to completion.

```js
ChatWidget.endAudio();
```

#### `ChatWidget.playStream(mediaStream)`

Play audio from a `MediaStream` object (e.g. from WebRTC). Routes through the avatar for lip-sync.

```js
// Example: play incoming WebRTC audio through the avatar
const peerConnection = new RTCPeerConnection();
peerConnection.ontrack = (event) => {
    ChatWidget.playStream(event.streams[0]);
};
```

#### `ChatWidget.stopAudio()`

Immediately stop all audio playback (one-shot, streaming, and MediaStream).

```js
ChatWidget.stopAudio();
```

---

### Animation

#### `ChatWidget.playAnimation(name)`

> **Auto-animation**: When `addBotMessage()` is called without `anim: false`, the widget automatically calls an AI-powered animation API to select a contextual animation based on the user's input and bot's response.

---

### Microphone / ASR

The widget includes a built-in microphone button. In **Botnoi mode**, ASR is handled automatically. In **Custom mode**, you wire your own ASR logic using these callbacks.

#### `ChatWidget.onMicToggle(callback)`

Register a callback for mic recording start/stop events.

```js
ChatWidget.onMicToggle(function(isRecording, data) {
    if (isRecording) {
        // Recording started
        // data.stream — the raw MediaStream
        console.log("Recording started");
    } else {
        if (data.error) {
            // "not-supported" or "permission-denied"
            console.error("Mic error:", data.error);
            return;
        }
        // Recording stopped
        // data.blob — the complete audio Blob (audio/webm;codecs=opus)
        // data.stream — the MediaStream (tracks already stopped)
        console.log("Got audio blob:", data.blob.size, "bytes");

        // Send to your ASR service:
        sendToASR(data.blob).then(transcript => {
            ChatWidget.addUserMessage(transcript);
        });
    }
});
```

#### `ChatWidget.onMicChunk(callback)`

Register a callback for real-time audio chunks during recording (fired every 250ms). Useful for streaming ASR.

```js
ChatWidget.onMicChunk(function(chunk) {
    // chunk is a Blob (audio/webm)
    websocket.send(chunk);
});
```

---

### Configuration

#### `ChatWidget.setVolume(value)`

Set the avatar audio volume.

| Parameter | Type | Description |
|---|---|---|
| `value` | `number` | Volume level from `0` (mute) to `1` (full). |

```js
ChatWidget.setVolume(0.5); // 50% volume
```

#### `ChatWidget.clearHistory()`

Clear all chat messages from the DOM and `localStorage`.

```js
ChatWidget.clearHistory();
```

#### `ChatWidget.setStatus(state, label)`

Update the status indicator in the chat header.

| Parameter | Type | Description |
|---|---|---|
| `state` | `"online"` \| `"offline"` | Controls the status dot color (green/gray). |
| `label` | `string` | Text displayed next to the dot (e.g. `"Connected"`, `"Offline"`). |

```js
ChatWidget.setStatus("online", "Connected");
ChatWidget.setStatus("offline", "Disconnected");
```

---

## Common Integration Patterns

### Pattern 1: Custom chatbot with your own API

```html
<script>
    window.ChatWidgetConfig = {
        provider: "custom",
        widgetId: "my-widget-001",
        title: "My AI Assistant"
    };
    (function() {
        if (document.getElementById('webavatar-jssdk')) return;
        var s = document.createElement('script');
        s.id = 'webavatar-jssdk';
        s.src = 'https://webavatar.didthat.cc/chat-widget.js';
        s.async = true;
        (document.head || document.body).appendChild(s);
    })();
</script>

<script>
ChatWidget.onUserMessage(async function(text) {
    // Call your backend
    const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
    });
    const data = await res.json();

    // Display bot response (auto-animates the avatar)
    ChatWidget.addBotMessage(data.reply);

    // If your API returns TTS audio
    if (data.audioUrl) {
        ChatWidget.playAudio(data.audioUrl);
    }
});
</script>
```

### Pattern 2: Streaming TTS with lip-sync (HTTP fetch)

```html
<script>
// Works with any TTS API that returns a streaming audio response
// (ElevenLabs, OpenAI, Google Cloud TTS, etc.)
ChatWidget.onUserMessage(async function(text) {
    ChatWidget.addBotMessage("Speaking...", { anim: false });

    const response = await fetch("/api/tts-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text })
    });

    const reader = response.body.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        ChatWidget.pushAudioChunk(value.buffer);
    }
    ChatWidget.endAudio(); // Always call after the last chunk
});
</script>
```

### Pattern 2b: Streaming TTS via WebSocket (raw PCM)

```html
<script>
// Example: Google Cloud TTS or Azure TTS over WebSocket delivering LINEAR16 PCM
const ws = new WebSocket("wss://your-tts-server.com/stream");
ws.binaryType = "arraybuffer";

ws.onmessage = function(event) {
    ChatWidget.pushAudioChunk(event.data, {
        pcm: true,
        sampleRate: 24000,
        channels: 1,
        bitDepth: 16
    });
};

ws.onclose = function() {
    ChatWidget.endAudio();
};
</script>
```

### Pattern 2c: Streaming TTS via WebSocket (base64 MP3)

```html
<script>
// Example: WebSocket API that sends JSON messages with base64 audio
const ws = new WebSocket("wss://your-tts-server.com/stream");

ws.onmessage = function(event) {
    const msg = JSON.parse(event.data);
    if (msg.audio) {
        ChatWidget.pushAudioChunk(msg.audio); // base64 string
    }
    if (msg.done) {
        ChatWidget.endAudio();
    }
};
</script>
```

### Pattern 3: Custom ASR (speech-to-text)

```html
<script>
    window.ChatWidgetConfig = {
        provider: "custom",
        widgetId: "my-widget",
        micLimit: 15
    };
    (function() {
        if (document.getElementById('webavatar-jssdk')) return;
        var s = document.createElement('script');
        s.id = 'webavatar-jssdk';
        s.src = 'https://webavatar.didthat.cc/chat-widget.js';
        s.async = true;
        (document.head || document.body).appendChild(s);
    })();
</script>

<script>
// Register mic callback to handle recording results
ChatWidget.onMicToggle(async function(isRecording, data) {
    if (!isRecording && data.blob) {
        ChatWidget.setStatus("online", "Transcribing...");

        const formData = new FormData();
        formData.append("audio", data.blob, "recording.webm");

        const res = await fetch("/api/asr", { method: "POST", body: formData });
        const result = await res.json();

        if (result.transcript) {
            ChatWidget.addUserMessage(result.transcript);
        }
        ChatWidget.setStatus("online", "Ready");
    }
});
</script>
```

### Pattern 4: WebRTC voice agent

```html
<script>
// Assuming a WebRTC connection to a voice AI agent
peerConnection.ontrack = function(event) {
    // Route incoming audio through the avatar for lip-sync
    ChatWidget.playStream(event.streams[0]);
};
</script>
```

### Pattern 5: Botnoi with pre-configured credentials

```html
<script>
    window.ChatWidgetConfig = {
        botId: "64464df59f76af17c9ca0ed3",
        bnvVersion: "1",
        bnvSpeaker: "13",
        avatarUrl: "Botnoi",
        title: "My Botnoi Bot"
    };
    (function() {
        if (document.getElementById('webavatar-jssdk')) return;
        var s = document.createElement('script');
        s.id = 'webavatar-jssdk';
        s.src = 'https://webavatar.didthat.cc/chat-widget.js';
        s.async = true;
        (document.head || document.body).appendChild(s);
    })();
</script>
```

---

## Troubleshooting

### Widget doesn't appear

- Ensure `window.ChatWidgetConfig` is set **before** the loader IIFE runs.
- Check the browser console for errors.
- The widget injects a floating action button (bottom-right by default). Look for `#botnoi-chat-widget` in the DOM.

### "Connecting…" state never resolves (Botnoi mode)

- Verify `botId` is correct in your `ChatWidgetConfig`.
- Look for CORS errors in the console.

### Mic button doesn't work

- Microphone requires **HTTPS** (or `localhost`).
- The user must grant mic permission.
- `onMicToggle` callback will receive `{ error: "not-supported" }` or `{ error: "permission-denied" }`.

### Avatar doesn't show

- Check that the avatar script URL is reachable.
- The avatar only becomes visible when the chat panel is open.

### Auto-animation not working (Custom mode)

- Set `widgetId` in your `ChatWidgetConfig` to a valid widget ID registered on the animation API server.
- The animation API validates the `Origin` header against the widget ID — the embedding page's domain must be registered.

---

*Generated from source: `chat-widget/` and `avatar-widget/` modules.*
