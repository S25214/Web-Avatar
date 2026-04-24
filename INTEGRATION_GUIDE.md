# WebAvatar Chat Widget — Integration Guide

> **Audience**: External developers embedding the chat widget into a website.
> This document covers everything needed to install, configure, and interact with the widget via its public JavaScript API. No source code access is required.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Provider Modes](#provider-modes)
3. [Script Tag Attributes Reference](#script-tag-attributes-reference)
4. [JavaScript API — `window.ChatWidget`](#javascript-api--windowchatwidget)
5. [Avatar Widget API — `window.WebAvatar`](#avatar-widget-api--windowwebavatar)
6. [Common Integration Patterns](#common-integration-patterns)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

Add a single `<script>` tag before the closing `</body>` tag. The widget injects its own UI (floating action button + chat panel) automatically.

### Botnoi Provider (managed backend)

```html
<script
  src="https://webavatar.didthat.cc/chat-widget.js"
  data-bot-id="YOUR_BOT_ID"
  data-bnv-version="1"
  data-bnv-speaker="13"
  data-avatar-url="Botnoi"
></script>
```

The widget connects to the Botnoi chatbot backend, handles TTS, ASR, animations, and avatar lip-sync automatically.

### Custom Provider (bring your own backend)

```html
<script
  src="https://webavatar.didthat.cc/chat-widget.js"
  data-provider="custom"
  data-widget-id="your-widget-id"
  data-title="My Assistant"
  data-avatar-url="Botnoi"
></script>
```

In custom mode, **no backend is loaded**. You control all messaging, audio, and animation through the `window.ChatWidget` JavaScript API.

---

## Provider Modes

The widget supports two mutually exclusive provider modes, determined at load time.

### Botnoi Provider (`data-provider="botnoi"` or `data-bot-id` is present)

- **Fully managed**: connects to Botnoi chatbot platform realtime messaging.
- **Built-in TTS**: generates voice from bot responses using Botnoi Voice API.
- **Built-in ASR**: microphone button records audio → sends to Botnoi ASR endpoint → auto-fills user message.
- **Auto-animation**: AI selects contextual avatar animations based on conversation content.
- **Setup form**: if `data-bot-id` is not provided, a setup form is shown inside the panel for the user to enter credentials.

### Custom Provider (`data-provider="custom"` or no `data-bot-id`)

- **No backend loaded**: TTS and ASR are not initialized.
- **You handle everything**: listen for user messages via `ChatWidget.onUserMessage()`, generate your own responses, and inject them via `ChatWidget.addBotMessage()`.
- **Optional avatar**: the 3D avatar still loads and can be controlled via `ChatWidget.playAudio()`.
- **Optional mic**: register your own ASR logic via `ChatWidget.onMicToggle()` and `ChatWidget.onMicChunk()`.

### Provider Detection Logic

The provider is resolved in this order:

1. If `data-provider="custom"` is explicitly set → **Custom mode**
2. If `data-provider` is any other value → **Botnoi mode**
3. If `data-provider` is not set but `data-bot-id` is present → **Botnoi mode**
4. If neither `data-provider` nor `data-bot-id` is set → **Custom mode**

---

## Script Tag Attributes Reference

All configuration is done via `data-*` attributes on the `<script>` tag.

### Universal Attributes (both providers)

| Attribute | Type | Default | Description |
|---|---|---|---|
| `data-provider` | `"custom"` \| `"botnoi"` | Auto-detected | Explicitly set the provider mode. |
| `data-title` | `string` | `"Botnoi Assistant"` | Text shown in the chat panel header. |
| `data-avatar-url` | `string` | `"Botnoi"` | VRM model name (from the built-in model list) or a full URL to a `.vrm` file. |
| `data-persist-history` | `"true"` \| `"false"` | `"true"` | Persist chat history in `localStorage` across page reloads. Set to `"false"` to disable. |
| `data-auto-focus-input` | `"true"` \| `"false"` | `"false"` | Auto-focus the text input when the chat panel opens. |

### Custom Provider Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `data-widget-id` | `string` | `""` | Widget ID for animation API authentication. The server validates this against the `Origin` header. Required for auto-animation to work in custom mode. |
| `data-mic-limit` | `number` (seconds) | `0` (unlimited) | Maximum microphone recording duration in seconds. `0` means no limit. |

### Botnoi Provider Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `data-bot-id` | `string` | `""` | Your Botnoi chatbot ID. |
| `data-bnv-version` | `"1"` \| `"2"` | `"1"` | Botnoi Voice API version for TTS. |
| `data-bnv-speaker` | `string` | `"13"` | Botnoi Voice speaker ID for TTS. |

> **Note**: In Botnoi mode, `data-mic-limit` is always forced to `10` seconds regardless of any attribute value.

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
<script
  src="https://webavatar.didthat.cc/chat-widget.js"
  data-provider="custom"
  data-widget-id="my-widget-001"
  data-title="My AI Assistant"
></script>

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
<script
  src="https://webavatar.didthat.cc/chat-widget.js"
  data-provider="custom"
  data-widget-id="my-widget"
  data-mic-limit="15"
></script>

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
<script
  src="https://webavatar.didthat.cc/chat-widget.js"
  data-bot-id="64464df59f76af17c9ca0ed3"
  data-bnv-version="1"
  data-bnv-speaker="13"
  data-avatar-url="Botnoi"
  data-title="My Botnoi Bot"
></script>
```

---

## Troubleshooting

### Widget doesn't appear

- Ensure the script is loaded **before** `</body>` or after DOM is ready.
- Check the browser console for errors.
- The widget injects a floating action button (bottom-right by default). Look for `#botnoi-chat-widget` in the DOM.

### "Connecting…" state never resolves (Botnoi mode)

- Verify `data-bot-id` is correct.
- Look for CORS errors in the console.

### Mic button doesn't work

- Microphone requires **HTTPS** (or `localhost`).
- The user must grant mic permission.
- `onMicToggle` callback will receive `{ error: "not-supported" }` or `{ error: "permission-denied" }`.

### Avatar doesn't show

- Check that the avatar script URL is reachable.
- The avatar only becomes visible when the chat panel is open.

### Auto-animation not working (Custom mode)

- Set `data-widget-id` to a valid widget ID registered on the animation API server.
- The animation API validates the `Origin` header against the widget ID — the embedding page's domain must be registered.

---

*Generated from source: `chat-widget/` and `avatar-widget/` modules.*
