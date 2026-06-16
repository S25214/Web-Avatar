# WebAvatar Botnoi Integration Guide (AI-Ready)

This guide provides a condensed reference for integrating the WebAvatar Chat Widget using the **Botnoi Provider** (managed backend). Use this when you want the widget to handle LLM, TTS, ASR, and Avatar animations automatically via Botnoi's platform.

---

## 1. Quick Start

Paste the universal embed snippet into your HTML before `</body>`. Botnoi mode is active when `botId` is present or `provider` is set to `"botnoi"`.

Works on **any framework**: plain HTML, React, Vue, Angular, Next.js, Svelte.

```html
<script>
    window.ChatWidgetConfig = {
        botId: "6968cd587ace167772741bb8",
        bnvVersion: "2",
        bnvSpeaker: "43",
        avatarUrl: "https://r2-avatar-bucket.vvin.cc/vrm/presets/UncleCMU.vrm",
        animationUrl: "Greeting",
        defaultAnimationUrl: "Idleloop, CrossArmLoop, Idle_HandsBehindBack, Idle_holdinghands, idle_breatheloop",
        randomGeneric: "false",
        color: "" // change theme color hex e.g. "#ffffff"
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

For **React/Vue/Angular/Svelte**, paste the JavaScript body into your component's mount lifecycle (`useEffect`, `onMounted`, `ngAfterViewInit`, `onMount`) — the code is identical, no translation needed.

---

## 2. Configuration (`window.ChatWidgetConfig`)

### Botnoi-Specific
| Key | Description |
|---|---|
| `botId` | **Required**. Your Botnoi Chatbot ID. |
| `bnvVersion` | Botnoi Voice API version (`"1"` or `"2"`). Default: `"1"`. |
| `bnvSpeaker` | Botnoi Voice speaker ID. Default: `"13"`. |

### Universal
| Key | Description |
|---|---|
| `avatarUrl` | Built-in name (e.g., `"Botnoi"`) or full URL to a `.vrm` file. |
| `title` | Title shown in the chat header. |
| `persistHistory` | `"true"` or `"false"` (default: `"true"`). |
| `color` | Theme color hex, e.g. `"#a7e6ff"`. |
| `defaultAnimationUrl` | Idle animation(s) to loop (single name or comma-separated list). |
| `animationUrl` | Initial animation to play on load. |
| `container` | Selector string or direct DOM element to render the widget inside instead of viewport-fixed. |

---

## 3. Managed Features

In Botnoi mode, the following are handled **automatically**:
- **Real-time Messaging**: Connects to the Botnoi chatbot engine.
- **Auto-TTS**: Generates voice for every bot response using Botnoi Voice.
- **Auto-ASR**: Microphone recording sends audio to Botnoi ASR and triggers a message.
- **Auto-Animation**: AI selects avatar animations based on the context of the conversation.

---

## 4. JavaScript API (Optional Overrides)

Even in managed mode, you can use `window.ChatWidget` for custom interactions.

### Listening to Events
```js
// Listen to user messages sent
ChatWidget.onUserMessage((text) => {
    console.log("User sent:", text);
});
```

### Manual Injection
```js
// Manually add a bot message (e.g., a system greeting)
ChatWidget.addBotMessage("Welcome! I am your managed assistant.");

// Manually play an animation
ChatWidget.playAnimation("Greeting");
```

### UI Control
```js
// Update status manually if needed
ChatWidget.setStatus("online", "Connected to Botnoi");

// Clear managed history
ChatWidget.clearHistory();
```

---

## 5. Troubleshooting for AI Agents
- **"Connecting..." Stuck**: Check if `botId` is valid. Open the panel to see if a setup form appears (this happens if the ID is missing).
- **No Voice**: Check `bnvVersion` and `bnvSpeaker`. Verify the browser isn't blocking autoplay (audio requires user interaction like clicking the widget FAB).
- **Mic Limit**: Remember that in Botnoi mode, the recording is hard-limited to 10 seconds.
