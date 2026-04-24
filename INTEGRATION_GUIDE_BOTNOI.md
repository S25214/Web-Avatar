# WebAvatar Botnoi Integration Guide (AI-Ready)

This guide provides a condensed reference for integrating the WebAvatar Chat Widget using the **Botnoi Provider** (managed backend). Use this when you want the widget to handle LLM, TTS, ASR, and Avatar animations automatically via Botnoi's platform.

---

## 1. Quick Start

Add this script to your HTML before `</body>`. Botnoi mode is active if `data-bot-id` is present or `data-provider="botnoi"`.

```html
<script
  src="https://webavatar.didthat.cc/chat-widget.js"
  data-bot-id="YOUR_BOTNOI_BOT_ID"
  data-bnv-version="1"
  data-bnv-speaker="13"
  data-avatar-url="Botnoi"
></script>
```

---

## 2. Configuration Attributes (`data-*`)

### Botnoi-Specific
| Attribute | Description |
|---|---|
| `data-bot-id` | **Required**. Your Botnoi Chatbot ID. |
| `data-bnv-version` | Botnoi Voice API version (`"1"` or `"2"`). Default: `"1"`. |
| `data-bnv-speaker` | Botnoi Voice speaker ID. Default: `"13"`. |

### Universal
| Attribute | Description |
|---|---|
| `data-avatar-url` | Built-in name (e.g., `"Botnoi"`) or full URL to a `.vrm` file. |
| `data-title` | Title shown in the chat header. |
| `data-persist-history`| `"true"` or `"false"` (default: `"true"`). |

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
// Listen to user messages sent to Botnoi
ChatWidget.onUserMessage((text) => {
    console.log("User sent to Botnoi:", text);
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
- **"Connecting..." Stuck**: Check if `data-bot-id` is valid. Open the panel to see if a setup form appears (this happens if the ID is missing).
- **CORS Errors**: Ensure the domain where you are embedding the widget is allowed in your Botnoi dashboard settings.
- **No Voice**: Check `data-bnv-version` and `data-bnv-speaker`. Verify the browser isn't blocking autoplay (audio requires user interaction like clicking the widget FAB).
- **Mic Limit**: Remember that in Botnoi mode, the recording is hard-limited to 10 seconds.
