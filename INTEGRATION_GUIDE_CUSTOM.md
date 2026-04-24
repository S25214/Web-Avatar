# WebAvatar Custom Integration Guide (AI-Ready)

This guide provides a condensed reference for integrating the WebAvatar Chat Widget using **Custom Provider** mode. Use this when you want to handle your own LLM, TTS, and ASR logic while using the widget for UI and Avatar rendering.

---

## 1. Quick Start

Add this script to your HTML before `</body>`. Custom mode is triggered by `data-provider="custom"`.

```html
<script
  src="https://webavatar.didthat.cc/chat-widget.js"
  data-provider="custom"
  data-widget-id="your-widget-id"
  data-title="AI Assistant"
  data-avatar-url="Botnoi"
></script>
```

---

## 2. Configuration Attributes (`data-*`)

| Attribute | Description |
|---|---|
| `data-provider` | Must be `"custom"`. |
| `data-widget-id` | Required for AI auto-animation to work in custom mode. |
| `data-avatar-url` | Built-in name (e.g., `"Botnoi"`) or full URL to a `.vrm` file. |
| `data-title` | Title shown in the chat header. |
| `data-mic-limit` | Max recording seconds (default: 0 = unlimited). |
| `data-persist-history`| `"true"` or `"false"` (default: `"true"`). |

---

## 3. JavaScript API — `window.ChatWidget`

### Messaging
- `ChatWidget.onUserMessage(callback)`: Registers a listener for user inputs. `callback(text)`.
- `ChatWidget.addBotMessage(text, options?)`: Adds a bot bubble.
    - `options.audio`: URL/Base64 to play (with lipsync).
    - `options.animation`: Named animation to play (e.g., `"Greeting"`).
    - `options.anim`: `false` to disable auto-animation.
- `ChatWidget.addUserMessage(text)`: Programmatically adds a user bubble.

### Audio & Lipsync
- `ChatWidget.playAudio(source)`: Plays one-shot audio (URL or Base64).
- `ChatWidget.pushAudioChunk(chunk, options?)`: For streaming TTS.
    - `chunk`: `ArrayBuffer`, `Uint8Array`, or Base64 string.
    - `options.pcm`: `true` for raw PCM data.
    - `options.sampleRate`: Default `24000`.
- `ChatWidget.endAudio()`: **CRITICAL**: Call after the last chunk to flush the buffer.
- `ChatWidget.stopAudio()`: Stops all current playback.
- `ChatWidget.playStream(mediaStream)`: Routes a `MediaStream` (e.g., WebRTC) to the avatar.

### Microphone & ASR
- `ChatWidget.onMicToggle(callback)`: Fires when mic starts/stops.
    - `callback(isRecording, data)`: `data.blob` contains the recorded WebM/Opus audio.
- `ChatWidget.onMicChunk(callback)`: Real-time chunks (every 250ms) for streaming ASR.

### UI & State
- `ChatWidget.setStatus(state, label)`: Sets header status dot (`"online"`/`"offline"`) and text.
- `ChatWidget.setVolume(0-1)`: Sets avatar volume.
- `ChatWidget.clearHistory()`: Wipes messages and local storage.

---

## 4. Implementation Patterns

### Basic Request-Response
```js
ChatWidget.onUserMessage(async (text) => {
    const res = await fetch("/chat", { method: "POST", body: JSON.stringify({text}) });
    const { reply, audioUrl } = await res.json();
    ChatWidget.addBotMessage(reply, { audio: audioUrl });
});
```

### Streaming TTS (Fetch)
```js
ChatWidget.onUserMessage(async (text) => {
    const response = await fetch("/stream-tts", { ... });
    const reader = response.body.getReader();
    ChatWidget.addBotMessage("...");
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        ChatWidget.pushAudioChunk(value.buffer);
    }
    ChatWidget.endAudio();
});
```

### Custom ASR
```js
ChatWidget.onMicToggle(async (isRecording, data) => {
    if (!isRecording && data.blob) {
        ChatWidget.setStatus("online", "Thinking...");
        const transcript = await myASR(data.blob);
        ChatWidget.addUserMessage(transcript);
    }
});
```

---

## 5. Troubleshooting for AI Agents
- **No Avatar?**: Ensure `data-avatar-url` is valid and the panel is open.
- **Audio Lag?**: Use `pushAudioChunk` with raw PCM or self-decodable MP3 frames.
- **Auto-anim fails?**: Check `data-widget-id` and ensure your domain (Origin) is authorized.
- **Mic errors?**: Must use **HTTPS**. Check `data.error` in `onMicToggle`.
