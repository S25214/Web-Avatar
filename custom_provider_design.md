# Custom Provider Feature — Design Document

## Understanding Summary

- **What:** A custom provider architecture for the chat-widget that decouples the visual frontend (chat bubbles, avatar lipsync, animations) from any specific backend
- **Why:** To make the widget a universal frontend standard — developers get a polished avatar chat UI without being locked to Botnoi's backend
- **Who:** Web developers embedding the widget via `<script>` tag on any site, using their own AI/TTS/ASR backends
- **Key constraints:** No dedicated server required, single script tag CDN distribution, backward-compatible with existing Botnoi provider
- **Non-goals:** No npm package, no multi-conversation support, no built-in ASR/TTS processing

---

## Assumptions

1. Provider mode selected via `data-provider="custom"` attribute; Botnoi is default when `data-bot-id` is present
2. Widget ID + Origin validation for animation API auth; Botnoi keeps its JWT path
3. Chat history defaults to persisted (`localStorage`), opt-out via `data-persist-history="false"`
4. Mic button is core UI; provider/developer supplies the handler for audio data
5. Animation auto-triggers on `addBotMessage` by default (`anim: true`), standalone `playAnimation()` also available
6. Both file-based and streaming (chunked push + MediaStream) TTS supported
7. Both recording-based and streaming-based ASR audio delivery supported
8. Graceful degradation: animation API failure → idle pose + lipsync, no crash
9. In custom mode, Botnoi code is **never loaded** — dynamic import used

---

## Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Audio streaming latency < 200ms to avatar mouth. TTS queue sequential. |
| Scale | One conversation per widget instance per page |
| Security | Widget ID is public, validated server-side via Origin header. No secrets in client code. |
| Reliability | Animation API failure → silent fallback to idle + lipsync. Audio failure → warning message. |
| Distribution | Single `<script>` tag from CDN. No npm package. |

---

## Decision Log

| # | Decision | Alternatives Considered | Rationale |
|---|---|---|---|
| 1 | **Global JS API** (`window.ChatWidget.*`) for developer integration | Library/SDK import, CustomEvents, Hybrid | Easiest drop-in for existing sites. No build step needed. Matches current `<script>` tag model. |
| 2 | **Widget owns mic button**, developer/provider provides handler | Developer owns button, Widget button + developer handler combo | Enables Botnoi provider to add ASR later without UI changes. Consistent UX across providers. |
| 3 | **Both chunked push AND MediaStream** for TTS streaming | Chunked only, MediaStream only | Maximum provider compatibility. WebSocket backends use chunks, WebRTC uses MediaStream. |
| 4 | **Both coupled and independent** message/audio calls | Coupled only, Independent only | `addBotMessage(text, {audio})` for convenience. Standalone `playAudio()` / `addBotMessage()` for advanced use. |
| 5 | **Auto-animation with opt-out** (`anim: true` default) + standalone `playAnimation()` | Developer controls explicitly, Optional in coupled call only | Animation API moved to core as a smart default. Reduces developer burden. Advanced users can override. |
| 6 | **Public Widget ID + Origin validation** for animation API auth | Open/no auth, Developer provides JWT, Proxy-based | No secrets in client code. Standard pattern (Google Maps, Firebase). Botnoi keeps JWT independently. |
| 7 | **Config-based provider selection** (`data-provider="custom"`) | Register-based, Hybrid callback registration | Simplest mental model. Script tag declares intent. No runtime configuration needed. |
| 8 | **Callback registration** for inbound events | DOM CustomEvents, Both | Simpler, more discoverable. No namespace collision risks. |
| 9 | **Persist history by default**, opt-out via `data-persist-history="false"` | Always persist, Never in custom mode, Developer's choice | Most users expect persistence. Opt-out available for stateless backends. |
| 10 | **Provider Interface pattern** for architecture | Flat mode switch | Clean separation. Easy to add future providers (Dialogflow, Rasa). Botnoi refactor is minimal. |

---

## Final Design

### Public API Surface

```javascript
window.ChatWidget = {
  // === Messages ===
  addBotMessage(text, options?),    // options: { audio?, animation?, anim? }
  addUserMessage(text),             // Shows user bubble, saves history, fires callback

  // === Audio / TTS ===
  playAudio(source),                // URL, base64, or data URI → avatar lipsyncs
  pushAudioChunk(chunk),            // ArrayBuffer/Uint8Array → buffered streaming
  endAudio(),                       // Signals end of streamed audio
  playStream(mediaStream),          // MediaStream → avatar lipsyncs
  stopAudio(),                      // Stops current playback

  // === Animation ===
  playAnimation(name),              // Manually trigger a named animation

  // === Mic / ASR ===
  onMicToggle(callback),            // callback(isRecording, { stream?, blob?, error? })
  onMicChunk(callback),             // callback(chunk) — for streaming ASR

  // === Chat Events ===
  onUserMessage(callback),          // callback(text) — user typed + sent

  // === Configuration ===
  setVolume(value),                 // 0-1
  clearHistory(),                   // Clears chat + optionally localStorage
  setStatus(state, label),          // 'online'|'offline', label text
}
```

### File Structure

```
chat-widget/
  core/
    config.js        ← [MODIFY] add PROVIDER, WIDGET_ID, PERSIST_HISTORY
    state.js         ← [MODIFY] make provider-agnostic (remove Botnoi-specific fields)
    ui.js            ← [UNCHANGED]
    html.js          ← [MODIFY] add mic button to input area template
    css.js           ← [MODIFY] add mic button + recording indicator styles
    audio.js         ← [UNCHANGED]
    animation.js     ← [NEW] triggerAnimation() with dual auth (widget-id / jwt)
    mic.js           ← [NEW] MediaRecorder lifecycle, chunk emission
    api.js           ← [NEW] window.ChatWidget public API facade
    init.js          ← [NEW] extracted core UI init from index.js
  botnoi/
    index.js         ← [MODIFY] updated imports only
    ably.js          ← [MODIFY] import triggerAnimation from core/animation.js
    api.js           ← [MODIFY] remove triggerAnimationApi (moved to core)
    setup.js         ← [UNCHANGED]
  index.js           ← [MODIFY] provider router (custom vs botnoi)
```

### Entry Point Router (`index.js`)

```javascript
import { config } from './core/config.js';
import { initCoreUI } from './core/init.js';
import { exposePublicAPI } from './core/api.js';

// 1. Always init core UI (DOM, styles, events, mic button)
initCoreUI();

// 2. Always expose public API (window.ChatWidget)
exposePublicAPI();

// 3. Route to provider
if (config.PROVIDER === 'custom') {
    // Ready. Developer drives via ChatWidget.*
    // No Botnoi scripts loaded.
    setStatus('online', 'Ready');
} else {
    // Default: Botnoi provider
    import('./botnoi/index.js').then(({ loadAblyAndInitBotnoi }) => {
        // existing panel open/init logic
    });
}
```

### Data Flows

#### Custom Provider Mode
```
Developer's Backend                    Chat Widget Core
─────────────────                    ────────────────
                                     User types → bubble rendered
                                         ↓
                                     onUserMessage(callback) fires
         ←── callback(text) ─────────────┘

   Developer does NLU/LLM
         │
         ├── ChatWidget.addBotMessage(text, {audio: url})
         │       ↓
         │   bubble rendered → playAudio(url) → avatar lipsyncs
         │                   → triggerAnimation(widgetId auth) → avatar animates
         │
         └── OR streaming:
             ChatWidget.pushAudioChunk(chunk) → buffer → avatar lipsyncs live
             ChatWidget.endAudio()
```

#### Botnoi Provider Mode (unchanged behavior)
```
User types → sendMessage() → Botnoi API → Ably channel
                                              ↓
                              bot-reply event received
                                              ↓
                              handleBotReply() → bubble rendered
                                              ↓
                              generateVoiceApi(JWT auth) → playAudio
                              triggerAnimation(JWT auth) → avatar animates
```

#### Mic Flow (both modes)
```
User presses mic → core/mic.js starts MediaRecorder
    ↓                          ↓
onMicChunk(chunk)         Recording indicator visible
    ↓
User presses again → stop → onMicToggle(false, {stream, blob})
    ↓
Developer/Provider does ASR → ChatWidget.addUserMessage(transcript)
```

### Animation API Auth

```
┌─────────────────────────────────────────────────┐
│ Animation API (getanim backend — you own this)  │
│                                                 │
│  Accepts two auth paths:                        │
│  1. Widget ID + Origin header validation        │
│  2. JWT Bearer token (Botnoi legacy)            │
│                                                 │
│  Rate-limited per Widget ID                     │
│  Returns: { animation: "Greeting" } or null     │
└─────────────────────────────────────────────────┘
```

### Edge Cases

| Scenario | Behavior |
|---|---|
| `addBotMessage` called before widget DOM ready | Queued internally, flushed when ready |
| `pushAudioChunk` with no prior chunks | Starts new buffer session automatically |
| `endAudio` with no active stream | No-op |
| Animation API unreachable | Silent fallback to idle + lipsync |
| Mic permission denied | `onMicToggle(false, { error: 'permission-denied' })` |
| `playAudio` while streaming active | Stops streaming, starts file playback |
| Botnoi-only features called in custom mode | No-op |
| Invalid `data-provider` value | Falls back to Botnoi (default) |
| `clearHistory()` with persistence off | Clears DOM only |

### Developer Integration Example

```html
<!-- Drop-in script tag -->
<script src="https://webavatar.didthat.cc/chat-widget.js"
        data-provider="custom"
        data-widget-id="wid_abc123"
        data-avatar-url="MyAvatar"
        data-title="My Assistant">
</script>

<script>
  // Listen for user messages
  ChatWidget.onUserMessage(async (text) => {
    // Send to your own backend
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: text })
    });
    const data = await response.json();

    // Show bot response with audio
    ChatWidget.addBotMessage(data.reply, {
      audio: data.tts_audio_url
    });
  });

  // Handle mic recording for ASR
  ChatWidget.onMicToggle((isRecording, { blob }) => {
    if (!isRecording && blob) {
      // Send audio to your ASR backend
      const formData = new FormData();
      formData.append('audio', blob);
      fetch('/api/asr', { method: 'POST', body: formData })
        .then(r => r.json())
        .then(data => ChatWidget.addUserMessage(data.transcript));
    }
  });
</script>
```

---

## Testing Strategy

1. **`custom-provider-demo.html`** — New demo page with buttons to simulate all API calls
2. **Botnoi regression** — Verify existing `chat-widget-demo.html` works identically
3. **Network verification** — In custom mode, confirm zero Ably/Botnoi network requests
4. **Mic permissions** — Test grant, deny, and revoke scenarios
5. **Streaming audio** — Test chunked push with synthetic audio data
6. **History persistence** — Test with `data-persist-history` true/false, page reload
