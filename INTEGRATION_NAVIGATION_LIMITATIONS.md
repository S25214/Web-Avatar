# WebAvatar Widget: Site Integration & Navigation Limitations

This document outlines the technical requirements, capabilities, limitations, and compatibility guidelines for parent websites integrating the WebAvatar widget's auto-navigation and site automation tools.

## 1. Framework Compatibility

The WebAvatar DOM Scanner is framework-agnostic and interacts directly with the browser's native DOM.

- **Traditional Multi-Page Sites (HTML/PHP/Ruby/Django)**: Works entirely out-of-the-box. Navigation forces a standard `window.location.href` redirect.
- **Single Page Applications (React, Vue, Angular, Svelte)**: Highly compatible, but requires event listeners for seamless routing and state synchronization.
  - **Routing**: When the AI attempts to navigate, it dispatches a cancelable `webavatar-navigate` CustomEvent. SPA developers should listen for this event, call `e.preventDefault()`, and pass the `e.detail.target` to their internal router (e.g., `react-router-dom`'s `useNavigate`) to prevent a hard page reload. If the event is unhandled, the widget safely falls back to a hard reload.
  - **Form & Input State Synchronization**: The `fill_form_fields` and dropdown selectors bypass framework-specific synthetic events (like React's virtual DOM) by using native prototype property setters (e.g., `HTMLInputElement.prototype.value.set`, `HTMLTextAreaElement.prototype.value.set`, or `HTMLSelectElement.prototype.value.set`) and dispatching native `focus`, `input`, `change`, and `blur` events. This ensures that two-way binding frameworks recognize the AI's input accurately.

---

## 2. Element Recognition Rules

The `DomScanner.js` engine scans and parses the page using accessibility guidelines and semantic elements. If elements do not conform to semantic standards, they may not be recognized.

### Navigation Links (`navigate_parent_site`)
- **Required Tag**: Looks strictly for `<a href="...">`. JavaScript-based navigation using buttons or divs is not recognized under routes.
- **Fuzzy Semantic Matching**: The AI can navigate using semantic guesses (e.g., "about us" matches `/about`). A direct matching label/href must be present in the scanned routes.
- **Same-Origin Only**: For security reasons, links leading to external domains are ignored.
- **Labels**: Prioritizes `aria-label` > `title` > visible text content > URL path.

### Interactive Buttons (`click_element`)
- **Required Tag/Role**: Recognizes `<button>`, `<input type="button">`, `<input type="submit">`, or any element with a `role="button"` attribute.
- **Labels**: Prioritizes `aria-label` > `title` > visible text content > input value.
- **Context Enrichment**: To distinguish generic buttons (e.g., "Add", "Buy", "+", "-"), the scanner automatically crawls up to 4 DOM parent levels to find headings (`h1`–`h6`) or elements containing class names with `title`, `name`, `header`, or `label`. It appends this context (e.g., `Add to cart (Product Name)`) to improve clicking accuracy.
- **Sequential Click Count**: The `click_element` tool accepts an optional `count` parameter. The widget can automatically click a targeted element multiple times sequentially (with a 100ms delay between clicks), which is perfect for incrementing quantities.

### Form Fields & Dropdowns (`fill_form_fields`, `select_dropdown_option`)
- **Form Tag Types**: Supports `<input>`, `<textarea>`, and `<select>`.
- **Dropdown Option Querying**: When interacting with `<select>` elements (typically identified with `type="select-one"` or `type="select-multiple"`), the AI must query all available options (values and text labels) via `get_dropdown_options` and select options via `select_dropdown_option`. The AI should not use `fill_form_fields` for dropdowns. (Custom div-based dropdowns are not natively supported).
- **Date / Calendar Fields**: When filling elements with `type="date"`, the AI must use `fill_form_fields` and format the date value strictly as a `YYYY-MM-DD` string (e.g. `2026-06-11`).
- **Dynamic Selector Assignment**: Fields no longer strictly require a static `id` or `name` attribute to be scanned. If neither is found, the scanner dynamically generates and assigns a temporary `data-webavatar-id="wa-X"` attribute to build a reliable CSS selector.
- **Visibility**: Excludes hidden fields (`type="hidden"`), disabled/readonly elements, and elements with `display: none` or `visibility: hidden`.

### Scroll Sections (`scroll_to_element`)
- **Container Tags**: The element must be a semantic structural tag (`<section>`, `<div>`, `<main>`, `<article>`, `<aside>`, `<header>`, `<footer>`).
- **Required ID**: The element must have an `id` attribute at least 3 characters long (e.g., `id="pricing-plans"`).
- **Naming Constraints**: Elements with IDs matching WebAvatar's internal prefixes (`bcw-`, `avatar-`, `botnoi-`, `webavatar-`) are safely ignored to avoid scrolling to widget components.

### Collapsible Panels & Accordions (`scan_current_page`)
- **Required Tag/Attribute**: Recognizes `<details>` or elements possessing the `aria-expanded` attribute.
- **Details Support**: When clicking a `<details>` element, the handler automatically redirects the click to its nested `<summary>` element to guarantee toggling. The AI receives the component's state (`expanded` or `collapsed`) dynamically.

---

## 3. Known Limitations

1. **Uncapped Scan Limits (Performance & Latency)**:
   By default, the scanner limits are set to `0` (uncapped), meaning all eligible routes, sections, inputs, buttons, and panels are scanned. 
   - *Best Practice*: Pages with extremely large DOM trees can lead to large token payloads, increased latency, and higher API usage. Developers should design clean, concise pages, or split complex multi-step forms across multiple pages.

2. **Shadow DOM Compatibility**:
   `document.querySelectorAll` does not pierce Shadow DOM boundaries. Web Components that encapsulate elements inside shadow roots are invisible to the WebAvatar DOM scanner.

3. **Dynamic / Async Content**:
   The AI does not run continuous background scanning. It calls the `scan_current_page` tool explicitly when needed (e.g., upon load, page change, or custom trigger). If the parent site dynamically injects content, the AI discovers it on its next explicit scan.

4. **Canvas / WebGL / Flash**:
   Elements drawn within canvas contexts or WebGL layers are completely invisible to the DOM Scanner.

5. **Non-Standard Custom JS Widgets**:
   If a parent site uses completely custom, non-semantic JS widgets (e.g. customized dropdowns using nested divs/spans instead of native select tags or buttons without `role="button"`), the scanner may fail to identify or interact with them. Always append semantic ARIA attributes or roles to custom interactive components.

