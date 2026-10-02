# Standalone event session design

This is an isolated Firestore design for `standalone-live.html`. Nothing in this
directory is imported by the existing page or deployed to Firestore. The page
is currently plain HTML and JavaScript, so the React hook is for a future
React/Next.js standalone host; it does not start a listener in the existing
page by itself.

## Current standalone event entry check

The actual `standalone-live.html` now has a separate refresh-time entry gate in
`standalone-live/event-gate.js`. For an event QR, use:

```text
https://webavatar.didthat.cc/standalone-live.html?id=YOUR_WIDGET_ID&client_api_key=URL_ENCODED_CLIENT_API_KEY&name=URL_ENCODED_GUEST_NAME
```

`event_key=ACTUAL_CLIENT_API_KEY` is also accepted for compatibility, but its
value must be the real API key; a friendly code such as `event-02102026` cannot
be resolved without a backend mapping endpoint. When either parameter is
present, the page shows a loading screen and calls authenticated
`GET /api/generations?page=1&limit=1` with `cache: no-store` before loading the
avatar or resuming a saved generation. HTTP 2xx enters the page; HTTP 401/403
shows an event-ended message; other failures show a retry action. Each page
refresh repeats this check. Visits without either parameter keep the original
manual API-key behavior.

`name=` is optional. If present, the decoded name is used for the avatar and
shown in Settings for this visit, even if the browser had another name saved.
It does not overwrite the saved name. Encode non-ASCII names when building the
QR URL, for example `encodeURIComponent('คุณผู้ร่วมงาน')`.

The image API must return a readable HTTP 401/403 response with CORS headers
when a key is revoked. If the browser cannot read the status because CORS
blocks the response, it will show the temporary-error retry screen instead.
The API should also mark this validation response `Cache-Control: no-store`.

This refresh-time check does **not** kick an already-open page immediately.
Revoking the key should make the generation backend deny future requests, but
the avatar may remain open until refresh. The Firestore listener below remains
an optional future design if immediate UI revocation is needed. Also, the key
is visible in the URL and browser history; use a short-lived event-scoped key
that can be revoked without affecting other clients.

## Firestore schema

Use a dedicated kiosk Firebase project with its own Firestore database and one document per event at
`events/{event_key}`. The document ID **is** the URL's `event_key`; no query or
collection listing is necessary. Example:

```text
events/EVT-12345
  event_key:       "EVT-12345"                string
  is_active:       true                       boolean
  expires_at:      <Firestore Timestamp>      timestamp
  created_at:      <Firestore Timestamp>      timestamp
  updated_at:      <Firestore Timestamp>      timestamp
  deactivated_at:  null                       timestamp | null
  display_name:    "Example event"            string
```

`EVT-12345` only illustrates the shape. In production, use a cryptographically
random, unguessable key (at least 128 bits) in the QR URL. The key acts as a
bearer locator: anyone who learns it can retrieve the public event document.
This scheme cannot establish physical attendance or prevent someone sharing
the URL. Keep client API keys, admin identities, private audit details, and
other secrets in a server-only collection/database. The public timestamps
above provide safe lifecycle audit metadata; write detailed audit logs from
trusted admin code elsewhere.

## Rules and administration

[`firestore.rules`](./firestore.rules) is a **complete ruleset for a dedicated
Firebase project**, with direct document reads only and all client writes denied.
Firestore rules are scoped to a database, not a web page. Deploying this file
to the shared `(default)` database would replace its rules and could break
production. If a dedicated project is unavailable, merge only the `events`
match block into the existing ruleset after reviewing all overlapping match
rules; an `allow` in another match can still grant access. No rules are deployed
by these files.

Create and update events through an authorized backend using the Firebase Admin
SDK or equivalent server credentials, with administrator authentication and
authorization enforced there. Admin SDK calls bypass Firestore Security Rules.
Set `updated_at` on every change and `deactivated_at` when disabling an event.

## React integration example

Install compatible `react` and `firebase` packages in the standalone React
host. Create its Firebase app from the dedicated kiosk project's configuration
and pass `getFirestore(app)` to the hook. In Next.js, call the hook only from a
client component. Then:

```tsx
const eventKey = new URLSearchParams(window.location.search).get('event_key');
const { status, isKickedOut, canAccess } = useEventSession(kioskDb, eventKey);

if (!canAccess) return <EventAccessScreen status={status} />;
return <StandaloneAvatarScene />;
```

When `isKickedOut` becomes true, stop camera tracks, close avatar/voice
connections, and hide the kiosk scene. The hook also denies access on missing
key, expiry, errors, and loss of a server-confirmed snapshot. It unsubscribes
when the component unmounts or the key changes. A local timer updates the UI at
`expires_at` even if the document does not change.

The listener gives prompt UI revocation while connected; it cannot promise
instantaneous delivery or prevent a modified client from making requests.
Enforce event activity and expiration on the backend when issuing avatar
sessions and accepting photo-generation requests, and terminate any live server
session when immediate server-side cutoff is required. Use server time for those
checks; the browser's clock is only for the UI timer.
