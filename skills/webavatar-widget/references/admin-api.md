# The developer API: creating and configuring widgets

The widget's settings (display style, avatar, voice, prompt, greeting, tools, allowed origins, navigation on/off, credit mode) live on the platform. There are two ways to change them: the platform's widget manager (`https://webavatar-gen-frontend.vercel.app/widget-manage`) and the developer API. This file does not repeat the API. Read the live documents:

- Interactive docs: https://asia-south1-rtdb-5706e.cloudfunctions.net/webavatarAdminApi/docs
- Machine-readable spec (OpenAPI 3.1): https://asia-south1-rtdb-5706e.cloudfunctions.net/webavatarAdminApi/openapi.json
- Base URL for calls: `https://asia-south1-rtdb-5706e.cloudfunctions.net/webavatarAdminApi`

Fetch `openapi.json` before building any request. The schemas below are summarised from it and may have changed.

## Authentication

Send a developer API key (`wak_live_...`) in the `X-API-Key` header, or as `Authorization: Bearer wak_live_...`. A developer creates keys in the platform's developer page, `https://webavatar-gen-frontend.vercel.app/developer`. The API cannot create keys with another key; they are created while signed in.

`GET /widgets/{id}/generate-embed` needs no authentication.

## Handling the key

- Ask the developer to export it as an environment variable, `WEBAVATAR_API_KEY`, in their own shell. Read it from there when you make a request.
- Never write the key into site code, a committed file, a `.env` file that is not git-ignored, a script you leave behind, or output you print. Do not echo request headers.
- If the developer pastes a key into chat anyway, use it for the session only and tell them to revoke and reissue it afterwards.

## Operations you will use

| Need | Call |
|---|---|
| List the developer's widgets | `GET /widgets` |
| Read one widget's settings | `GET /widgets/{id}` |
| Create a widget | `POST /widgets` (only `name` is required) |
| Change a widget | `PATCH /widgets/{id}` |
| Get the current embed snippet | `GET /widgets/{id}/generate-embed` (public) |
| See which providers and options exist (voices and so on) | `GET /provider-catalog` |
| Check credit balance | `GET /credit-status` |

The API also lists sessions and analytics. Delete exists (`DELETE /widgets/{id}`); never call it unless the developer explicitly asks to delete that named widget.

## Creating a widget for an embed

What an embed needs, and the defaults that surprise people:

| Field | Set it to | Why |
|---|---|---|
| `name` | a human name | required |
| `allowed_origins` | the site's origins, for example `["https://example.com", "https://*.example.com", "http://localhost:3000"]` | a page on an unlisted origin gets no session; a wildcard covers subdomains but not the bare domain, so list the apex separately; protocol and port are part of the origin |
| `nav_enabled` | `true` | defaults to `false`; with it off the assistant cannot navigate or operate the site |
| `mode` | `"realtime-widget"` | defaults to `"realtime-fullscreen"`, which takes over the whole window instead of floating over the site |

Anything else (`prompt`, `avatar`, `provider_settings` for the voice, `greeting_instruction`, `enable_bubble`, `tools`, `button_image`, `camera_offset`, `transfer_settings`) is optional. You may set these when the developer describes what they want; look each field up in `openapi.json` first, and do not invent values.

Example, with the key read from the environment:

```bash
curl -sS -X POST "https://asia-south1-rtdb-5706e.cloudfunctions.net/webavatarAdminApi/widgets" \
  -H "X-API-Key: $WEBAVATAR_API_KEY" -H "Content-Type: application/json" \
  -d '{"name":"My Site Assistant","mode":"realtime-widget","nav_enabled":true,"allowed_origins":["https://example.com","http://localhost:3000"]}'
```

The response contains the new widget with its `id`. That is the `widgetId` for the embed.

Credits: a widget's `credit_mode` defaults to `owner`, which means the developer's credits pay for every visitor's call. Tell the developer this before they publish the site. `session_limit` (the longest a call can last) is admin-editable only; leave it out.

## Rules for writing

The API changes the developer's live account, so:
1. **State each write before sending it** (method, path, and the fields) and wait for a yes. A read needs no confirmation.
2. **Read before you change.** `GET /widgets/{id}` first. Send only the fields you are changing in a `PATCH`. Never overwrite `prompt`, `avatar`, `provider_settings` or `tools` that the developer set in the platform unless they asked you to change that field.
3. **Read back after writing.** `GET` the widget again and confirm the fields you changed hold the values you meant. Report any difference.
4. **Never delete** a widget, and never change `credit_mode`, `partner_settings` or `session_limit`, unless the developer asks for that specific change.
5. If a call returns 401 or 403, stop and tell the developer; do not look for another key.
