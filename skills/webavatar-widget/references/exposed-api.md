# What the widget exposes to the host page

Everything here is optional. The embed works without any of it. Use it when the site needs a button that starts the call, wants to react to call state, wants to say something to the assistant on the visitor's behalf, or is a single-page app that should route in its own document.

`window.ChatWidget` also carries methods for other widget types (chat panel, custom backends: `addBotMessage`, `playAudio`, and so on). They do not apply to the floating assistant; do not use them.

## Knowing when it is ready

`window.ChatWidget` does not exist until the script has loaded and mounted the widget. Wait for the event rather than polling:

```js
document.addEventListener('webavatar:mounted', () => { /* window.ChatWidget is ready */ }, { once: true });
```

If the page code may run after the widget already mounted, also check `window.ChatWidget?.connect` first.

| Event | Target | When | `event.detail` |
|---|---|---|---|
| `webavatar:mounted` | `document` | the widget has mounted | `{ kind, instanceId, element }` |
| `webavatar:destroyed` | `document` | `destroy()` finished | `{ kind, instanceId, element }` |
| `onConnect` | `window` | a call has started | none |
| `onDisconnect` | `window` | a call that was connected has ended | none |

## Methods

| Call | Returns | What it does |
|---|---|---|
| `ChatWidget.connect()` | | Starts a call, as if the visitor pressed the call button. Call it from a click handler: the browser asks for the microphone and only allows audio after a user gesture. |
| `ChatWidget.disconnect()` | | Ends the call. |
| `ChatWidget.getRealtimeState()` | `{ connected: boolean, state: string, status: string }` | A snapshot: whether a call is connected, the session state, and the status text the widget shows. Treat `state` and `status` as display values, not a stable enumeration. |
| `ChatWidget.sendUserMessage(text)` | | Sends text to the assistant as if the visitor had said it. If the call is not connected yet, the message is queued and sent when it connects. |
| `ChatWidget.notify(text, options?)` | | Shows a short notice in the widget's own toast. `text` is trimmed to 300 characters. `options`: `autoDismissMs` (default 6000), `tone` (default `"info"`). |
| `ChatWidget.updateConfig(changes)` | `Promise` | Merges embed options and remounts the widget. Keys that the deployment controls (endpoints and similar) are refused with a `TypeError`. Rarely needed: settings live on the platform. |
| `ChatWidget.destroy()` | | Ends the call, removes the widget and its styles, and deletes `window.ChatWidget`. Use it only to remove the assistant for good, never on a route change. To load it again, remove the `webavatar-jssdk` script element first. |

Examples:

```js
// A "Talk to us" button on the site
document.querySelector('#talk').addEventListener('click', () => window.ChatWidget?.connect());

// Show call state in the site's own UI
window.addEventListener('onConnect', () => document.body.classList.add('assistant-on'));
window.addEventListener('onDisconnect', () => document.body.classList.remove('assistant-on'));

// Tell the assistant something the visitor just did on the page
window.ChatWidget?.sendUserMessage('The visitor just added a Blue Shirt to the cart.');
```

`sendUserMessage` enters the conversation as the visitor's words. Do not use it to pass secrets, and keep what you send short and factual, because every message is part of the conversation the assistant keeps in mind.

## Routing in your own document: `webavatar-navigate`

When the assistant needs to open a path of your site and no visible link on the page leads there, the widget normally loads that address as a full page load. A full page load ends the call and costs several seconds to reconnect, and on some single-page apps it also loses state that only the in-app router sets up (a search handed over in the address, for example).

A single-page app can take the navigation itself. Before loading the page, the widget dispatches a cancelable `webavatar-navigate` event on `window`:

- `event.detail.target`: the path with its query and hash, for example `/search?q=shoes#results`;
- `event.detail.url`: the full address.

It is only dispatched for same-origin addresses. If the handler calls `preventDefault()`, the widget treats the navigation as taken and waits up to 2.5 seconds for the page address to change, so the router must update `location` in that time. If nobody cancels the event, the widget does the full page load as before.

```js
window.addEventListener('webavatar-navigate', (event) => {
  const path = event.detail.target;
  if (!isPathOwnedByThisApp(path)) return;   // leave other paths to a normal page load
  event.preventDefault();
  router.push(path);                          // your router's navigation call
});
```

Rules for the handler:
- call `preventDefault()` only when you will actually navigate; cancelling and then doing nothing leaves the assistant waiting 2.5 seconds for an address change that never comes, and the page is not opened;
- use your router's own navigation call, not `window.location`, or you gain nothing;
- register it once, at app root, and remove it if the app root unmounts.

Visible links that the assistant clicks navigate softly by themselves in most single-page apps, so this hook is for paths without a visible link, and for routers whose behaviour a page load does not reproduce. It does no harm elsewhere.

## Marking your own UI as part of the assistant

The widget ignores its own elements when it reads or operates the page. If the site draws a panel around the avatar's slot, or its own controls that belong to the assistant, add `data-webavatar-instance` to that element:

```html
<aside data-webavatar-instance="host-panel"> ... </aside>
```

Consequences you must accept: everything inside is invisible to the assistant (it cannot read or click it), and a layer that sits exactly over the avatar's own area (within about 48 px of its edges) stops being treated as something that covers page controls. Do not put real site content inside it.

Element ids that start with `bcw-`, `avatar-`, `botnoi-` or `webavatar-` are also treated as the widget's own and are ignored. Never use those prefixes for site elements.
