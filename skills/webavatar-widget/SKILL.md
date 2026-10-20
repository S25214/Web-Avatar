---
name: webavatar-widget
description: Embed the WebAvatar assistant widget in a website and prepare the site so the assistant can read it, navigate it and fill its forms reliably. Use when the user wants to add, fix, audit or configure the WebAvatar chat/voice widget, needs a widget ID, wants the assistant to navigate or operate their pages, or asks about window.ChatWidget, the webavatar-navigate event, or the WebAvatar developer API.
---

# WebAvatar widget: embed it and make the site work with it

The widget is a talking 3D assistant that a visitor can speak or type to. It can read the page the visitor is on, point at things, follow links, click, and fill in forms on the visitor's behalf. What it can do on a site depends on how well the site's markup describes itself. This skill covers installing the widget and fixing the markup.

The only embed parameter is `widgetId`. Everything else (avatar, voice, prompt, greeting, display style, tools, allowed origins, whether navigation is on) is a widget setting stored on the platform, not in site code.

## Workflow

Do these in order. Do not skip the first two: an embed that is not allowed to run on the site's origin, or that has navigation switched off, loads but does nothing useful.

0. **Ask which build to use: production or dev.** Ask the developer before writing anything: "Do you want the production widget or the dev widget?" Production is for live sites and is the default if they have no preference. Dev is for testing a pre-release widget. Remember the answer; the embed script address depends on it (see [references/embed.md](references/embed.md)).
1. **Get a widget ID.** Ask the developer for one. If they have none, offer to create one through the developer API (see [references/admin-api.md](references/admin-api.md)); otherwise point them to the platform's widget manager, `https://webavatar-gen-frontend.vercel.app/widget-manage`.
2. **Check the widget's settings** (read them through the API if the developer gave you a key, otherwise ask them to check in the platform):
   - the site's origin is in the widget's allowed origins, including every origin you will test on (protocol, host and port: `http://localhost:3000` is a different origin from `https://example.com`);
   - site navigation is on (it is off for a new widget);
   - the display style is the floating widget, not full screen.
3. **Embed the widget** once per page load, at the root of the app. See [references/embed.md](references/embed.md).
4. **Audit and improve the site's markup**, applying the low-risk fixes and reporting the rest. See [references/site-practices.md](references/site-practices.md) and the audit rules below.
5. **Wire optional host integration** only if the developer wants it: a button that starts the call, reacting to call state, or in-app routing for a single-page app. See [references/exposed-api.md](references/exposed-api.md).
6. **Verify**: run the checks in [references/troubleshooting.md](references/troubleshooting.md).

## Audit rules: what to change and what to report

Change directly (low risk, no visible design change, easy to review in a diff):
- add `aria-label` to icon-only buttons and links, and to repeated action buttons ("Remove Blue shirt", not "Remove");
- associate every form field with a `<label for>` or `aria-label`, and give fields a `name`;
- add `type="button"` to buttons that must not submit a form;
- add `alt` to meaningful images;
- add `id` to sections a visitor might ask to be shown (`id="pricing"`);
- add `aria-expanded` / `aria-controls` / `aria-current` / `aria-selected` / `aria-pressed` where the code already toggles that state;
- add the `webavatar-navigate` listener to a single-page app's router (see exposed-api);
- rename element ids that start with `bcw-`, `avatar-`, `botnoi-` or `webavatar-` (the widget ignores them as its own).

Report to the developer and leave to them (changes layout, behaviour or architecture):
- replacing clickable `div`/`span` elements with real `button`/`a` elements;
- turning client-only navigation into real links, adding a sitemap, or server-rendering a navigation shell;
- reworking custom dropdowns, menus, dialogs or date pickers;
- anything that touches checkout, payment, authentication or deletion flows;
- content inside iframes, canvas or closed shadow roots.

## Rules

- Never put an API key in site code, in committed files, or in logs. See the admin reference.
- Never ask the developer to paste a key into chat if an environment variable can hold it.
- Do not add the widget to a page twice. The loader snippet guards against it with the script id `webavatar-jssdk`; keep that guard.
- The embedded widget does not ask the visitor to confirm actions before it performs them. Do not rely on it to guard payments, deletions or other irreversible steps. Those steps belong behind the site's own explicit, visitor-operated control.
- Do not invent widget settings. If a setting is not in this skill or the API spec, it is not an embed option.
