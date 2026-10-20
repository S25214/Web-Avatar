# Verifying and troubleshooting

## Quick checks after embedding

In the browser console on a page that carries the embed:

```js
typeof window.ChatWidget          // "object" once the widget has mounted
window.ChatWidget.getRealtimeState()   // { connected, state, status }
```

Then, with the network panel open, start a call. A request for the widget's configuration and a session request should succeed. A rejected session request almost always means the origin is not allowed.

A useful proxy for "what the assistant sees": open the browser's accessibility tree for the page (DevTools, Elements, Accessibility). A control that shows no name there has no name for the assistant either. A control missing from the tree is not operable.

## A short manual test

Run these with the call connected, on at least one page with a form and one with a repeated list:
1. "What is on this page?" — it should describe the page's real content.
2. "Show me <a section>" — it scrolls to and highlights it.
3. "Open <a page in the navigation>" — it navigates, and the call stays up on a single-page app.
4. "Fill in the form with <values>" and then check the fields. Fields for passwords or payment stay empty on purpose.
5. In a list: "Remove the second item" or "Add the <name> to the cart" — the right row changes.
6. Open a dialog and ask for something inside it, then something outside it.

## Symptoms

| Symptom | Likely cause | What to check or do |
|---|---|---|
| Nothing appears | script not loaded, or the origin is not allowed, or `enabled` is off | network panel for `chat-widget.js`; console for `[ChatWidget]` messages; the widget's allowed origins (protocol, host, port); the widget is enabled |
| The widget covers the whole window | the widget's display style is full screen | set `mode` to `realtime-widget` in the platform (or via the API) |
| Appears but the call will not start | microphone blocked, page not HTTPS, or the call was started without a user click | use HTTPS or `localhost`; check the site's `Permissions-Policy`; start the call from a click |
| Talks, but cannot open pages or click anything | site navigation is off for this widget | `nav_enabled` must be `true` |
| Opens pages but the call drops at each navigation | the site does full page loads | make internal links client-side routed, or use the multi-page option in [embed.md](embed.md) |
| "Could not find" a button or link that is on screen | no accessible name, a generic name in a repeated row, or the control is not a real control | give it an `aria-label`, put it in a row with a heading, use a real `button`/`a` |
| Clicks the wrong row | repeated buttons share one name | add the item name to each button's `aria-label` |
| Says something covers the control | an overlay, banner or invisible layer is on top | remove or close the layer; see [site-practices.md](site-practices.md) section 6 |
| Leaves a field empty | the field is treated as private (password, payment, one-time code, or its id/name/label contains a private word such as PIN or expiry) | rename a non-private field; let the visitor fill real private fields |
| Fills a field but the form says it is empty | the framework ignores the written value | make sure the field is a real input bound to the framework through its own `input`/`change` handlers |
| Works on the home page, fails on an inner page | the page is rendered after load or in an iframe | make sure the inner page's content is in the DOM and not inside an iframe |
| Cannot find a page that exists | not linked in the HTML, no sitemap, links only built on the client | add real links and `/sitemap.xml` |
| Two assistants appear | the loader ran twice, or the framework mounted it on every route | load once at app root; keep the `webavatar-jssdk` guard |
| The widget will not come back after `destroy()` | the loader's guard sees the old script tag | remove `#webavatar-jssdk` before loading again |
| CSP errors in the console | the policy blocks the script or its connections | allow exactly the hosts the console reports |

## Reporting a problem

When the cause is not in the table, collect: the page URL, what was asked, what the assistant said it did, the console output, and the widget ID. Session logs for a widget are available through the developer API (`GET /sessions`, see [admin-api.md](admin-api.md)).
