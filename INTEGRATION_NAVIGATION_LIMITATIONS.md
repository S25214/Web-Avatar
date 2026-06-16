# WebAvatar Widget: Site Integration & Navigation Limitations

This document outlines the technical requirements, capabilities, limitations, and compatibility guidelines for parent websites integrating the WebAvatar widget's auto-navigation and site automation tools.

## 1. Framework Compatibility

The WebAvatar DOM Scanner is framework-agnostic and interacts directly with the browser's native DOM.

- **Traditional Multi-Page Sites (HTML/PHP/Ruby/Django)**: Works entirely out-of-the-box. Navigation forces a standard `window.location.href` redirect.
- **Single Page Applications (React, Vue, Angular, Svelte)**: Highly compatible, but requires event listeners for seamless routing and state synchronization.
  - **Routing**: When the AI attempts to navigate, it dispatches a cancelable `webavatar-navigate` CustomEvent. SPA developers should listen for this event, call `e.preventDefault()`, and pass the `e.detail.target` to their internal router (e.g., `react-router-dom`'s `useNavigate`) to prevent a hard page reload. If the event is unhandled, the widget safely falls back to a hard reload.
  - **Form & Input State Synchronization**: The `fill_form_fields` and dropdown selectors bypass framework-specific synthetic events (like React's virtual DOM) by using native prototype property setters (e.g., `HTMLInputElement.prototype.value.set`, `HTMLTextAreaElement.prototype.value.set`, or `HTMLSelectElement.prototype.value.set`) and dispatching native `focus`, `input`, `change`, and `blur` events. This ensures that two-way binding frameworks recognize the AI's input accurately.

---

## 2. Navigation Workflow

The AI navigates pages using a **section-first discovery** approach:

1. **`discover_sections`** — Discovers high-level UI regions on the page (e.g., navigation bar, product menu, shopping cart). Returns a list of sections with selectors, interactive element counts, and available page routes.
2. **`scan_section`** — Scans a specific section (identified by its selector from step 1) for interactive elements: buttons, form fields, and expandable panels. Returns only elements inside that section.
3. **`click_element`** / **`fill_form_fields`** / etc. — Performs actions on specific elements. `click_element` automatically detects and reports UI changes after the click.

This workflow prevents the AI from blindly scanning the entire page and ensures it understands the page's structure before interacting.

---

## 3. Section Discovery Rules (`discover_sections`)

The section discovery algorithm uses a **3-tier detection strategy**:

### Tier 1 — Semantic Landmarks (highest confidence)
- Recognizes `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>`, `<section>`, `<article>`, and elements with `role="navigation"`, `role="region"`, `role="complementary"`, `role="banner"`, `role="contentinfo"`.
- Labels derived from: `aria-label` > `aria-labelledby` (resolving the referenced element's text) > first child heading (`h1`–`h4`) > tag name humanized (e.g., `<nav>` → "Navigation").

### Tier 2 — Structural Heuristic (medium confidence)
- Finds `<div>` or `<form>` containers that contain **≥2 interactive children** (buttons, inputs, links) AND have a heading child or `aria-label`.
- Catches structures like a product card grid wrapped in `<div class="menu-items">`.
- De-duplication: Tier 2 sections fully contained inside a Tier 1 section are suppressed.

### Tier 3 — Body Fallback
- If Tiers 1 and 2 yield zero sections, returns a single "Page Content" section for `<body>`.

### Section Response Shape
Each section reports:
- `sel` — CSS selector for the section
- `label` — Human-readable label
- `tag` — HTML tag name
- `interactiveCount` — Number of interactive elements (excluding those in nested sub-sections)
- `visible` — Whether the section is currently displayed

---

## 4. Element Recognition Rules

### Navigation Links (`navigate_parent_site`)
- **Required Tag**: Looks strictly for `<a href="...">`. JavaScript-based navigation using buttons or divs is not recognized under routes.
- **Fuzzy Semantic Matching**: The AI can navigate using semantic guesses (e.g., "about us" matches `/about`). A direct matching label/href must be present in the scanned routes.
- **Same-Origin Only**: For security reasons, links leading to external domains are ignored.
- **Labels**: Prioritizes `aria-label` > `title` > visible text content > URL path.

### Interactive Buttons (`click_element`)
- **Required Tag/Role**: Recognizes `<button>`, `<input type="button">`, `<input type="submit">`, or any element with a `role="button"` attribute.
- **Labels**: Prioritizes `aria-label` > `title` > visible text content > input value.
- **Context Enrichment**: To distinguish generic buttons (e.g., "Add", "Buy", "+", "-"), the scanner automatically crawls up to 4 DOM parent levels to find headings (`h1`–`h6`) or elements containing class names with `title`, `name`, `header`, or `label`. It appends this context (e.g., `Add to cart (Product Name)`) to improve clicking accuracy.
- **Change Detection**: After clicking, the tool automatically detects UI changes by comparing snapshots of interactive elements before and after the click. It reports what `appeared`, `disappeared`, or was `modified`.
- **Multi-Click Safety**: The `click_element` tool accepts an optional `count` parameter. For each click, it re-validates that the element still exists. If the element disappears (e.g., "Add to Cart" becomes quantity controls), it stops immediately and reports `stoppedReason` with the number of actual clicks performed and the UI changes detected.

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

### Collapsible Panels & Accordions (`scan_section`)
- **Required Tag/Attribute**: Recognizes `<details>` or elements possessing the `aria-expanded` attribute.
- **Details Support**: When clicking a `<details>` element, the handler automatically redirects the click to its nested `<summary>` element to guarantee toggling. The AI receives the component's state (`expanded` or `collapsed`) dynamically.

---

## 5. Known Limitations

1. **Shadow DOM Compatibility**:
   `document.querySelectorAll` does not pierce Shadow DOM boundaries. Web Components that encapsulate elements inside shadow roots are invisible to the WebAvatar DOM scanner.

2. **Dynamic / Async Content**:
   The AI does not run continuous background scanning. It calls `discover_sections` and `scan_section` explicitly when needed (e.g., upon load, page change, or after clicking). If the parent site dynamically injects content, the AI discovers it on its next explicit scan.

3. **Canvas / WebGL / Flash**:
   Elements drawn within canvas contexts or WebGL layers are completely invisible to the DOM Scanner.

4. **Non-Standard Custom JS Widgets**:
   If a parent site uses completely custom, non-semantic JS widgets (e.g. customized dropdowns using nested divs/spans instead of native select tags or buttons without `role="button"`), the scanner may fail to identify or interact with them. Always append semantic ARIA attributes or roles to custom interactive components.

5. **DOM Settlement Timing**:
   After clicking, the tool waits up to 1500ms for DOM mutations to settle (with a 400ms quiet period). Extremely slow API-driven UI updates that take longer than 1500ms may not be captured in the initial change report. The AI can run `scan_section` again to see the updated state.
