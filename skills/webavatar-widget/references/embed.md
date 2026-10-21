# Embedding the widget

## What you need

- A **widget ID** (8 lowercase letters and digits, for example `vx6pgqf1`). It is public; it is safe in site code.
- The site's origin listed in the widget's **allowed origins**. A page on an origin that is not listed does not get a session.
- A page served over **HTTPS** (or `localhost`). The browser only gives the microphone to secure pages.

`widgetId` is the only parameter to set. With only a widget ID the widget mounts as a floating assistant, provided the widget's saved display style on the platform is the floating one. Look and behaviour (avatar, voice, greeting, colours, launcher image) come from the platform.

## Production or dev build

Ask the developer which build they want, and do not assume:

| Build | Script address |
|---|---|
| Production (default, for live sites) | `https://webavatar.didthat.cc/chat-widget.js` |
| Dev (for testing a pre-release widget) | `https://webavatar.didthat.cc/chat-widget-dev.js` |

If they choose dev, use the dev address everywhere the production one appears below: in the loader's `script.src`, or in the plain tag's `src`. Nothing else in the snippet changes, and `widgetId` is still the only parameter.

Use exactly the one address they chose, written as a fixed string. Do not add anything that picks the build for them: no switch on `NODE_ENV`, build mode, hostname or an environment variable, no fallback from one build to the other. Moving to the production build later is the developer's own one-line change; mention it once, and do not make it for them.

## The snippet

Fetch the current snippet from the platform instead of copying one from this file, so it never goes stale. It needs no authentication:

```
GET https://asia-south1-rtdb-5706e.cloudfunctions.net/webavatarAdminApi/widgets/{widgetId}/generate-embed
```

The response has `scriptSnippet` (a loader) and `normalEmbed` (a plain script tag), both pointing at the production build. For the dev build, replace the script address with the dev one from the table above. The loader looks like this:

```html
<script>
  window.ChatWidgetConfig = {
    widgetId: "YOUR_WIDGET_ID"
  };
  (function () {
    if (document.getElementById('webavatar-jssdk')) return;
    var script = document.createElement('script');
    script.id = 'webavatar-jssdk';
    script.src = 'https://webavatar.didthat.cc/chat-widget.js';
    script.async = true;
    (document.head || document.body).appendChild(script);
  })();
</script>
```

Place it at the end of `<body>`, or in `<head>`: the widget waits for the DOM to be ready either way. Keep the `webavatar-jssdk` id and the guard line; they stop a second load.

The plain form works too: `<script src="https://webavatar.didthat.cc/chat-widget.js" data-widget-id="YOUR_WIDGET_ID" async></script>` (use `chat-widget-dev.js` for the dev build). When both forms are present, the `data-` attribute wins.

## Where it goes in each kind of site

- **Static HTML / server-rendered templates**: the shared layout or footer partial, so it appears on every page once.
- **Single-page apps (React, Next.js, Vue, Nuxt, Svelte, Angular)**: run the snippet once when the application's root mounts, never in a page or route component (those remount on every navigation and would restart the assistant). Guard server-side rendering with a `typeof window !== 'undefined'` check. The call and the avatar then survive route changes.
- **Do not call `destroy()` on route changes.** Use it only when the assistant must be removed for good (see [exposed-api.md](exposed-api.md)). After `destroy()`, remove the script element with id `webavatar-jssdk` before loading again, or the guard line stops the reload.
- **Tag managers / CMS**: paste the snippet as a custom HTML tag that fires once per page view.

## Local development

Add the dev origin to the widget's allowed origins, with the port: `http://localhost:3000`. `localhost` is exempt from the HTTPS rule for the microphone.

## Content Security Policy

If the site sends a CSP, allow `https://webavatar.didthat.cc` in `script-src`, and allow the connections the widget makes in `connect-src`. Do not guess the list: load the page, open the console, and add exactly the hosts the browser reports as blocked. Start from the platform's cloud function hosts (`*.cloudfunctions.net`) and the avatar asset hosts. If the CSP uses `require-trusted-types-for`, the widget works, but some site exploration features that parse fetched pages may report that they could not read other pages.

## Classic multi-page sites (optional)

When every link is a full page load, the call ends at each navigation and reconnects on the next page, which takes several seconds. If the site cannot be turned into a single-page app, the embed has one extra option that keeps the call alive across page loads:

```js
window.ChatWidgetConfig = { widgetId: "YOUR_WIDGET_ID", isMPA: true };
```

It works by loading the real site inside a full-window frame that the widget keeps alive. Caveats:
- it fails on sites that forbid framing themselves (`X-Frame-Options`, or CSP `frame-ancestors`);
- it replaces the top document's body with that frame, so scripts on the top page that expect the site's DOM will not find it;
- it is not used by the browser extension.

Offer it only when the call dropping on navigation is a real problem, and test every important page afterwards. This is not set from the platform; it exists only in the embed.

## After embedding

The widget sets `window.ChatWidget` when it has loaded and fires `webavatar:mounted` on `document`. Then check [troubleshooting.md](troubleshooting.md).
