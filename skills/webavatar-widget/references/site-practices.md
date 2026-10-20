# Making a site work well with the assistant

The assistant works from the page's rendered DOM, the way an assistive technology does. It does not read your source or your components. It sees: the visible text, the controls, their names and states, and where things are. Anything a screen reader user could not find or operate on the page is also hard for the assistant. Semantic HTML and accessible names are the whole technique; there are no widget-specific attributes to add (the few exceptions are marked below).

How it works, so the rules make sense:
- **Reading** answers questions about the page from its visible text, grouped into passages (a paragraph, a heading, or a whole card or row with all its parts) and sections (headings and landmarks), and it can scroll to and highlight a place.
- **Acting** (clicking, typing, choosing, navigating) works on a ranked list of the page's controls, each with a role, a name, nearby text, a state and a position. It picks the control that matches what the visitor asked for, performs it with real pointer/keyboard-style events, checks what changed, and continues until done or stuck.
- Each task is limited (about 32 decisions or 120 seconds). Long multi-screen flows are more likely to stop partway.

## 1. Use real interactive elements

The assistant finds: `a[href]`, `button`, `input`, `select`, `textarea`, `summary`, `video`/`audio`, `[contenteditable]`, and elements with a widget role (`button`, `link`, `checkbox`, `radio`, `switch`, `tab`, `menuitem`, `option`, `combobox`, `textbox`, `searchbox`, `slider`, `spinbutton`, `treeitem` and similar). It also guesses at `div`/`span` elements with `onclick`, `tabindex`, `data-action`, a `btn`/`button` class, or a pointer cursor, but with no name except their CSS classes, which makes them easy to mix up.

- Make clickable things `<button type="button">` or `<a href>`. Fix: replace clickable `div`/`span` (report this to the developer if it changes styling), or at least add `role="button"`, `tabindex="0"` and an `aria-label`.
- Disabled controls (`disabled`, `aria-disabled="true"`) are skipped. Use them only when a control really cannot be used right now.

## 2. Give every control a name

The name is taken in this order: `aria-labelledby`, `aria-label`, an associated `<label>`, a button's `value`, image `alt`, the visible text, `title`, `placeholder`. Icon-only SVG buttons fall back to the SVG's `<title>` or `aria-label`.

- Icon-only buttons and links need `aria-label` ("Open cart", "Close dialog"), unless they contain visible text.
- Do not rely on `placeholder` as the only label.
- Names should say what the control does in the words a visitor would use.

**Repeated controls.** In a list of products, rows or cards, every "Add", "Remove", "Edit" or "Buy" button has the same text. The assistant appends the nearest enclosing item's heading or label when the name is generic (very short, or one of add/remove/delete/edit/view/select/buy/checkout/close/cancel/submit). To make that work:
- put each item in an `li`, `tr`, `article` or `role="listitem"`;
- give each item a heading element (`h2`–`h4`) or an `aria-label`;
- better still, give the button a specific `aria-label`: `aria-label="Remove Blue shirt"`.

## 3. Show state in attributes

The assistant reads these to know what is on, open or current, and uses them to check that an action worked:
- `aria-expanded` (+ `aria-controls`) on anything that opens and closes: menus, accordions, disclosures. `<details>/<summary>` works natively.
- `aria-selected` on tabs, `aria-current="page"` on the current page link or page number, `aria-pressed` on toggle buttons, `aria-checked` on custom checkboxes and switches.
- Native `checked`, `selected`, `value`, `required`, `min`, `max`.
- Pagination and tabs that show the current item only with a colour are sometimes recognised, but do not rely on it: add `aria-current`.

## 4. Navigation menus

- Menus that open on click or focus, with `aria-expanded` and `aria-controls` pointing at the panel (and `aria-haspopup` where it applies), are recognised as ways to reveal more links. A menu that opens only on hover, with no attributes, is recognised only when a hidden list of links sits next to its title; give such menus a click/focus path with `aria-expanded`.
- A destination that is not linked from the current page can still be reached: the assistant searches same-origin links already on the page (including inside collapsed menus), then fetches the current page, `/sitemap.xml` and the main navigation pages (a handful of requests, two levels deep), read-only and without cookies. It never fetches logout, delete, cart-changing or API-looking addresses. So:
  - keep the main navigation as real `<a href>` links in the HTML the server returns;
  - publish `/sitemap.xml` for sites with many pages;
  - give "all pages" or hub pages a link;
  - a page shell that renders its links only on the client cannot be explored this way; the result is "could not tell", not "does not exist".
- Single-page apps: use real `<a href>` links driven by the router. The assistant clicks visible links, so soft navigation just works and the call stays up. For paths with no visible link, add the `webavatar-navigate` handler ([exposed-api.md](exposed-api.md)).
- Avoid navigation that exists only as an `onClick` handler on a non-link element: it cannot be found by address.

## 5. Forms

- Use a real `<form>`, real `<label>`s, and a real submit button (`<button type="submit">` or `<input type="submit">`). The assistant submits through the form's own button, or presses Enter in the field and requests the form's submit.
- Give fields `name` and `autocomplete` attributes, `required` (or `aria-required="true"`) on required ones, and `type` that matches the data (`email`, `tel`, `number`, `date`).
- The assistant types the way a person does: it focuses the field, sets the value, and fires `input` and `change`, which works with React, Vue and Angular controlled inputs. Do not clear or reformat a field on `blur` in a way that discards what was typed.
- Input masks are fine (`2,980,000`, `081-234-5678`, `05/09/2026`, `10%`): a field that shows the typed digits in its own format counts as filled.
- Prefer native `<select>`. For custom dropdowns, make the trigger `role="combobox"` (a `button` is fine) with `aria-expanded`, and the options `role="option"` inside a `role="listbox"`; the trigger's displayed text should be the current selection. Options rendered in a portal outside the dialog need `aria-controls` or `aria-owns` from the trigger.
- Custom checkboxes and radios: keep the real `<input>` in the DOM (even if visually hidden or transparent, with a real size), connected to a visible `<label for>`. Do not put `aria-hidden` or `display:none` on the input. A transparent input laid over a decorative label is handled; a pure `div` checkbox needs `role="checkbox"` and `aria-checked`.
- Search boxes: `<form role="search">` with a text input; pressing Enter must submit.
- When a task needs values the visitor has not given (a required field with nothing to fill it), the assistant asks the visitor for them instead of guessing. Required fields marked as `required` make this reliable.
- Consent boxes and terms are the visitor's decision. The assistant does not tick them without being told yes.

**Fields the assistant never reads or fills.** It treats these as private and skips them completely, both when reading values and when typing: `type="password"` and `type="file"`, fields with `autocomplete` of a payment/credential kind (`cc-*`, `one-time-code`, `current-password`, `new-password` and similar), and any field whose id, name, `aria-label`, placeholder or label matches words such as password, passcode, PIN, OTP, one-time code, verification code, security code, CVV/CVC, card number, name on card, credit/debit card, expiry, API key, secret key, private key, access token. So the visitor always enters payment details, passwords and verification codes themselves.

Watch out for false positives: a non-sensitive field named with one of those words is skipped too (a postal "PIN code", a "card number" for a library card, an "expiry date" for a coupon). Rename the label, `name`, and placeholder if the assistant should be able to fill it.

## 6. Dialogs, popups and overlays

- Use `<dialog>` opened with `showModal()`, or `role="dialog"` / `role="alertdialog"` with `aria-modal="true"`. While a modal is open the assistant only works inside it (plus popups linked by `aria-controls`/`aria-owns`), as a person would.
- Cookie banners, newsletter popups and chat bubbles that cover the page: the assistant reads an open popup first and can close it if the visitor asks. It does not click through a dialog or banner to reach something behind it. If a control is under something, the action fails and says what covers it.
- Do not leave invisible full-screen layers on top of the page (`position: fixed; inset: 0` with a transparent background that still takes clicks). They block every click. The one exception is a click-away layer behind an open menu: an empty, near-transparent layer covering a fifth of the screen or more whose id or class contains `backdrop`, `scrim`, `overlay`, `mask`, `shade`, `curtain` or `veil` is recognised and dismissed. Likewise a suggestion list or popover that opens beside a field (`role="listbox"`, `role="menu"`, `role="tooltip"`, or a class/id with `dropdown`, `autocomplete`, `suggest`, `popover`, `typeahead`) can be dismissed when it covers the target.
- A fixed or sticky header/footer that covers a control is handled by scrolling to uncover it. Page-transition curtains (a fixed, high z-index, full-viewport opaque layer with no controls) are waited out until they finish.
- A dark backdrop behind a dialog belongs to the dialog and is closed by the dialog's own close control, so give the dialog one with a name (`aria-label="Close"`).

## 7. What is invisible

Not read, not operated: `display: none`, `visibility: hidden`, `hidden`, `inert`, `aria-hidden="true"` (and everything inside them), zero-size elements, text with `opacity: 0`, anything in `<canvas>`, WebGL, or text drawn into images. Closed `<details>` hide their contents except the `<summary>`.

- Put real text in the DOM. Give informative images an `alt`. Do not put the only copy of a price, a deadline or a label inside an image or canvas.
- Do not mark real, usable controls `aria-hidden="true"`.
- Content that is not mounted yet (infinite scroll, virtualised lists, lazy tabs) cannot be found. The assistant scrolls the page to mount lazy content and can scroll inner scroll areas, but cannot know what a virtualised list holds. Offer search, filters, sorting and real pagination links so the target can be reached by a control.
- Text that ticks continuously (clocks, counters, live prices) is ignored on purpose when judging whether the page changed. Static copies of facts the visitor may ask about should exist in normal text.

## 8. Facts and structure for questions

When a visitor asks "what does it cost" or "which plan includes X", the assistant answers from the page text.
- Keep a thing and its facts together in one container: name, price and status in the same card, row (`tr`) or `li`, so they read as one passage.
- Use heading levels and landmarks (`header`, `nav`, `main`, `aside`, `footer`). They name the sections the assistant quotes from.
- Give sections that visitors will ask about a stable `id` (`id="pricing"`). The assistant can scroll to and highlight an element by id, and `#pricing` is the most reliable way to name a place.
- Use real tables (`table`, `th`) for tabular data.

## 9. Things the assistant cannot do

Design the site with these in mind; they are not bugs:
- Controls inside **iframes** (cross-origin or not) are out of reach for actions. Open shadow DOM works; **closed** shadow roots do not.
- **Canvas-only or WebGL UI**, games, maps whose only controls are drawn graphics.
- Controls that accept only a **trusted user event** (some video-player skip buttons, payment widgets, "Sign in with" popups). A script cannot produce one.
- **CAPTCHAs and bot checks.**
- Password, payment, one-time-code and file-upload fields (see above).
- It performs actions as the visitor, on the visitor's session, without a confirmation prompt of its own in the embedded widget. Make irreversible steps (placing an order, deleting an account, sending money) end at a control that is clearly the visitor's: a final review step with an explicit button, payment entered by the visitor, or a sign-in the site itself requires. The assistant's own caution is a heuristic, not a guarantee.

## 10. Names and ids to avoid

Element ids that start with `bcw-`, `avatar-`, `botnoi-` or `webavatar-`, the id `botnoi-chat-widget`, the id `webavatar-agent-host`, the class `bn-customerchat`, and the attribute `data-chat-widget` mark the widget's own elements. Anything carrying them is invisible to the assistant. If a site element uses one (`avatar-upload`, `webavatar-banner`), rename it (`profile-photo-upload`).

## Page loads and single-page apps

A full page load ends the call's in-page state. A task that was running is restored on the new page for about five minutes and its outcome is available to the assistant, but the call itself reconnects, which takes several seconds. Single-page apps keep the call; prefer client-side navigation for in-site links. See also the multi-page option in [embed.md](embed.md).

## Audit checklist for a coding agent

Search the code for these and fix or report according to the rules in `SKILL.md`:
1. `<button>` / `<a>` / `role="button"` with only an icon or an `<img>`/`<svg>` child and no `aria-label`.
2. `<input>`, `<select>`, `<textarea>` with no `<label for>`, no wrapping `<label>`, and no `aria-label`.
3. `onClick`/`@click`/`(click)` on `div`, `span`, `li`, `img`.
4. `<a>` with no `href`, or `href="#"` / `href="javascript:..."` with the real destination in a handler.
5. Repeated action buttons (map/v-for/ngFor) whose label does not include the item.
6. Custom dropdowns, tabs, accordions and menus without `aria-expanded` / `aria-selected` / `aria-controls`.
7. `aria-hidden="true"` or `display:none` on real inputs of custom checkboxes/radios.
8. Full-screen fixed overlays that stay mounted when closed.
9. Ids beginning with `bcw-`, `avatar-`, `botnoi-` or `webavatar-`.
10. Fields named with private words that are not private (PIN code, card number).
11. Navigation built only from client-side handlers; missing `/sitemap.xml` on large sites.
12. Sections visitors will ask about without an `id`.
