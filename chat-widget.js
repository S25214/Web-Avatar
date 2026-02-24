/**
 * Botnoi Chat Widget — Embeddable Script
 *
 * Usage:
 *   <script src="chat-widget.js" data-bot-id="YOUR_BOT_ID"></script>
 *
 * Optional attributes:
 *   data-worker-url="https://custom-worker.example.com"
 *   data-title="My Assistant"
 */
(function () {
    'use strict';

    // ─── Read config from the script tag ─────────────────────────────────
    const currentScript =
        document.currentScript ||
        (function () {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();

    let BOT_ID = currentScript.getAttribute('data-bot-id') || localStorage.getItem('bcw_bot_id') || '';
    const WORKER_URL =
        currentScript.getAttribute('data-worker-url') ||
        'https://botnoichatbot.didthat.workers.dev';
    const WIDGET_TITLE =
        currentScript.getAttribute('data-title') || 'Botnoi Assistant';

    // Avatar config
    const AVATAR_ENABLED = currentScript.getAttribute('data-avatar') !== 'false';
    let AVATAR_MODEL = currentScript.getAttribute('data-avatar-url') || localStorage.getItem('bcw_avatar_url') || 'Botnoi';

    // Botnoi Voice (TTS) config
    let BNV_KEY = currentScript.getAttribute('data-bnv-key') || localStorage.getItem('bcw_bnv_key') || '';
    let BNV_VERSION = parseInt(currentScript.getAttribute('data-bnv-version') || localStorage.getItem('bcw_bnv_version') || '1', 10);
    let BNV_SPEAKER = currentScript.getAttribute('data-bnv-speaker') || localStorage.getItem('bcw_bnv_speaker') || '13';

    // Config persistence (defaults to true)
    const CONFIG_SAVE = currentScript.getAttribute('data-config-save') !== 'false';
    // Config persistence (defaults to false)
    // const CONFIG_SAVE = currentScript.getAttribute('data-config-save') === 'true';
    if (!CONFIG_SAVE) {
        localStorage.removeItem('bcw_bot_id');
        localStorage.removeItem('bcw_bnv_key');
        localStorage.removeItem('bcw_bnv_version');
        localStorage.removeItem('bcw_bnv_speaker');
        localStorage.removeItem('bcw_avatar_url');
        // Re-read without localStorage fallback
        BOT_ID = currentScript.getAttribute('data-bot-id') || '';
        BNV_KEY = currentScript.getAttribute('data-bnv-key') || '';
        BNV_VERSION = parseInt(currentScript.getAttribute('data-bnv-version') || '1', 10);
        BNV_SPEAKER = currentScript.getAttribute('data-bnv-speaker') || '13';
        AVATAR_MODEL = currentScript.getAttribute('data-avatar-url') || 'Botnoi';
    }

    let needsSetup = !BOT_ID || !BNV_KEY;
    // localStorage.setItem('bcw_bot_id', '');
    // localStorage.setItem('bcw_bnv_key', '');

    // ─── CSS (scoped under #botnoi-chat-widget) ──────────────────────────
    const WIDGET_CSS = `
    :root {
      --bcw-primary: #a7e6ff;
      --bcw-primary-text: #272525;
      --bcw-secondary: #e2dfdf;
      --bcw-secondary-text: #272525;
      --bcw-bg: #f7f8fa;
      --bcw-surface: #ffffff;
      --bcw-border: #e0e0e0;
      --bcw-danger: #dc3545;
      --bcw-font: 'Segoe UI', system-ui, -apple-system, sans-serif;
      --bcw-fab-size: 56px;
    }

    /* ── Container & Reset ─────────────────────── */
    #botnoi-chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483646;
      font-family: var(--bcw-font);
      font-size: 14px;
      line-height: 1.4;
      box-sizing: border-box;
    }
    #botnoi-chat-widget *,
    #botnoi-chat-widget *::before,
    #botnoi-chat-widget *::after {
      box-sizing: border-box;
    }

    /* ── FAB ───────────────────────────────────── */
    #bcw-fab {
      width: var(--bcw-fab-size);
      height: var(--bcw-fab-size);
      border-radius: 50%;
      background: var(--bcw-primary);
      color: var(--bcw-primary-text);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.18);
      transition: transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s ease, opacity 0.25s ease;
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: 2;
      margin: 0;
      padding: 0;
    }
    #bcw-fab:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 20px rgba(0,0,0,0.22);
    }
    #bcw-fab.bcw-hidden {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.5);
    }
    #bcw-fab svg {
      width: 26px;
      height: 26px;
      fill: currentColor;
    }

    /* ── Chat Panel ────────────────────────────── */
    #bcw-panel {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 380px;
      height: 600px;
      max-height: calc(100vh - 40px);
      background: var(--bcw-surface);
      border: 1px solid var(--bcw-border);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      transform-origin: bottom right;
      transform: scale(0);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.3s ease;
    }
    #bcw-panel.bcw-visible {
      transform: scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    /* ── Header ──────────────────────────────────── */
    #bcw-header {
      display: flex;
      align-items: center;
      padding: 12px 14px;
      margin: 0;
      background: var(--bcw-surface);
      border-bottom: 1px solid var(--bcw-border);
      flex-shrink: 0;
      gap: 10px;
    }
    #bcw-header-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      display: none;
      margin: 0;
      padding: 0;
    }
    #bcw-header-avatar.bcw-show { display: block; }
    #bcw-header-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin: 0;
      padding: 0;
    }
    #bcw-header-title {
      font-weight: 700;
      font-size: 15px;
      color: #333;
      margin: 0;
      padding: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #bcw-header-status {
      display: flex;
      align-items: center;
      gap: 5px;
      margin: 0;
      padding: 0;
      font-size: 11px;
      color: #999;
    }
    #botnoi-chat-widget .bcw-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #999;
      flex-shrink: 0;
      margin: 0;
      padding: 0;
      transition: background 0.3s;
    }
    #botnoi-chat-widget .bcw-status-dot.bcw-online { background: #22c55e; }
    #botnoi-chat-widget .bcw-status-dot.bcw-offline { background: #ef4444; }
    #bcw-status-text {
      margin: 0;
      padding: 0;
    }
    #bcw-clear-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      margin: 0;
      border-radius: 6px;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    #bcw-clear-btn:hover { background: #ffe6e6; }
    #bcw-clear-btn svg { width: 16px; height: 16px; fill: var(--bcw-secondary-text); }
    #bcw-clear-btn:hover svg { fill: var(--bcw-danger); }

    /* ── Volume Control ────────────────────────── */
    #bcw-volume-group {
      display: flex;
      align-items: center;
      position: relative;
      flex-shrink: 0;
    }
    #bcw-volume-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      margin: 0;
      border-radius: 6px;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    #bcw-volume-btn:hover { background: var(--bcw-bg); }
    #bcw-volume-btn svg { width: 16px; height: 16px; fill: var(--bcw-secondary-text); }
    #bcw-volume-slider-wrap {
      overflow: hidden;
      width: 0;
      transition: width 0.25s ease;
      display: flex;
      align-items: center;
    }
    #bcw-volume-group:hover #bcw-volume-slider-wrap,
    #bcw-volume-slider-wrap.bcw-pinned {
      width: 80px;
    }
    #bcw-volume-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 72px;
      height: 20px;
      background: transparent;
      outline: none;
      margin: 0 4px;
      cursor: pointer;
    }
    #bcw-volume-slider::-webkit-slider-runnable-track {
      height: 4px;
      border-radius: 2px;
      background: var(--bcw-border);
    }
    #bcw-volume-slider::-moz-range-track {
      height: 4px;
      border-radius: 2px;
      background: var(--bcw-border);
    }
    #bcw-volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--bcw-primary-text);
      cursor: pointer;
      margin-top: -4px;
    }
    #bcw-volume-slider::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--bcw-primary-text);
      cursor: pointer;
      border: none;
    }

    /* ── Setup Form ─────────────────────────────── */
    #bcw-setup-form {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      flex: 1;
      padding: 28px 24px;
      gap: 16px;
      box-sizing: border-box;
      overflow: visible;
    }
    #bcw-setup-form .bcw-setup-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--bcw-secondary-text);
      margin: 0 0 4px 0;
      text-align: center;
    }
    #bcw-setup-form .bcw-setup-desc {
      font-size: 12px;
      color: #999;
      margin: 0 0 8px 0;
      text-align: center;
      line-height: 1.4;
    }
    #bcw-setup-form > label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      font-size: 12px;
      font-weight: 600;
      color: var(--bcw-secondary-text);
    }
    #bcw-setup-form input[type="text"] {
      width: 100%;
      padding: 10px 12px;
      border: 1.5px solid var(--bcw-border);
      border-radius: 10px;
      font-size: 13px;
      font-family: inherit;
      background: var(--bcw-bg);
      color: var(--bcw-secondary-text);
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    #bcw-setup-form input[type="text"]:focus {
      border-color: var(--bcw-primary);
    }
    #bcw-setup-form .bcw-setup-submit {
      width: 100%;
      padding: 11px;
      border: none;
      border-radius: 12px;
      background: var(--bcw-primary);
      color: var(--bcw-primary-text);
      font-size: 14px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      transition: opacity 0.2s;
      margin-top: 4px;
    }
    #bcw-setup-form .bcw-setup-submit:hover { opacity: 0.85; }
    #bcw-setup-form .bcw-setup-error {
      color: var(--bcw-danger);
      font-size: 12px;
      margin: 0;
      min-height: 16px;
    }
    /* ── Toggle Switch ──────────────────────── */
    .bcw-toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      box-sizing: border-box;
    }
    .bcw-toggle-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--bcw-secondary-text);
    }
    .bcw-toggle-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #999;
      flex-shrink: 0;
    }
    .bcw-toggle-wrap .bcw-active { color: var(--bcw-secondary-text); }
    .bcw-toggle {
      position: relative;
      width: 40px;
      height: 22px;
      flex-shrink: 0;
    }
    .bcw-toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .bcw-toggle-track {
      position: absolute;
      inset: 0;
      background: var(--bcw-border);
      border-radius: 11px;
      cursor: pointer;
      transition: background 0.25s;
    }
    .bcw-toggle-track::after {
      content: '';
      position: absolute;
      left: 2px;
      top: 2px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.25s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }
    .bcw-toggle input:checked + .bcw-toggle-track {
      background: var(--bcw-primary);
    }
    .bcw-toggle input:checked + .bcw-toggle-track::after {
      transform: translateX(18px);
    }
    #bcw-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      margin: 0;
      background: var(--bcw-bg);
      display: flex;
      flex-direction: column;
    }
    #bcw-messages::-webkit-scrollbar { width: 5px; }
    #bcw-messages::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }

    #botnoi-chat-widget .bcw-msg {
      margin: 0 0 10px 0;
      padding: 5px 10px;
      border-radius: 18px;
      max-width: 80%;
      word-wrap: break-word;
      font-size: 14px;
      line-height: 1.45;
      animation: bcw-fadeIn 0.25s ease;
      list-style: none;
    }
    @keyframes bcw-fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    #botnoi-chat-widget .bcw-user-msg {
      background: var(--bcw-secondary);
      color: var(--bcw-secondary-text);
      margin-left: auto;
      margin-right: 0;
      border-bottom-right-radius: 4px;
    }
    #botnoi-chat-widget .bcw-bot-msg {
      background: var(--bcw-primary);
      color: var(--bcw-primary-text);
      margin-right: auto;
      margin-left: 0;
      border-bottom-left-radius: 4px;
    }
    #botnoi-chat-widget .bcw-msg img,
    #botnoi-chat-widget .bcw-msg video {
      max-width: 100%;
      border-radius: 8px;
      margin-top: 5px;
      outline: none;
      padding: 0;
    }
    #botnoi-chat-widget .bcw-msg audio {
      max-width: 100%;
      margin-top: 5px;
      padding: 0;
    }
    #botnoi-chat-widget .bcw-msg a {
      color: inherit;
      text-decoration: underline;
      font-weight: 600;
    }

    /* ── Quick Replies ─────────────────────────── */
    #botnoi-chat-widget .bcw-quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 0 0 10px 0;
      padding: 0;
      justify-content: flex-start;
      flex-shrink: 0;
      list-style: none;
    }
    #botnoi-chat-widget .bcw-quick-reply-btn {
      padding: 8px 14px;
      margin: 0;
      background: var(--bcw-surface);
      border: 1.5px solid var(--bcw-primary);
      color: var(--bcw-primary-text);
      border-radius: 20px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: background 0.2s, color 0.2s;
      font-family: var(--bcw-font);
    }
    #botnoi-chat-widget .bcw-quick-reply-btn:hover {
      background: var(--bcw-primary);
      color: var(--bcw-primary-text);
    }

    /* ── Carousel ──────────────────────────────── */
    #botnoi-chat-widget .bcw-carousel-container {
      display: flex;
      overflow-x: auto;
      gap: 10px;
      padding: 4px 0 10px 0;
      margin: 0 0 10px 0;
      scroll-snap-type: x mandatory;
      flex-shrink: 0;
    }
    #botnoi-chat-widget .bcw-carousel-container::-webkit-scrollbar { height: 5px; }
    #botnoi-chat-widget .bcw-carousel-container::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
    #botnoi-chat-widget .bcw-carousel-card {
      min-width: 210px;
      max-width: 230px;
      border: 1px solid var(--bcw-border);
      border-radius: 10px;
      overflow: hidden;
      background: var(--bcw-surface);
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      scroll-snap-align: start;
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
    }
    #botnoi-chat-widget .bcw-carousel-img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      margin: 0;
      padding: 0;
    }
    #botnoi-chat-widget .bcw-carousel-body {
      padding: 10px;
      margin: 0;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    #botnoi-chat-widget .bcw-carousel-title {
      font-weight: 700;
      font-size: 14px;
      margin: 0 0 4px 0;
      padding: 0;
      color: #333;
    }
    #botnoi-chat-widget .bcw-carousel-subtitle {
      font-size: 12px;
      color: #666;
      margin: 0 0 10px 0;
      padding: 0;
      flex: 1;
    }
    #botnoi-chat-widget .bcw-carousel-btn {
      display: block;
      width: 100%;
      padding: 7px;
      margin: 5px 0 0 0;
      text-align: center;
      border: 1.5px solid var(--bcw-primary);
      background: var(--bcw-surface);
      color: var(--bcw-primary-text);
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: background 0.2s;
      font-family: var(--bcw-font);
    }
    #botnoi-chat-widget .bcw-carousel-btn:hover { background: var(--bcw-primary); }

    /* ── Input Area ────────────────────────────── */
    #bcw-input-area {
      display: flex;
      align-items: center;
      border-top: 1px solid var(--bcw-border);
      padding: 10px 12px;
      margin: 0;
      background: var(--bcw-surface);
      flex-shrink: 0;
    }
    #bcw-input {
      flex: 1;
      padding: 10px 14px;
      margin: 0;
      border: 1px solid var(--bcw-border);
      border-radius: 24px;
      outline: none;
      font-family: var(--bcw-font);
      font-size: 14px;
      transition: border-color 0.2s;
    }
    #bcw-input:focus { border-color: var(--bcw-primary); }
    #bcw-input:disabled { background: #f1f1f1; cursor: not-allowed; }
    #bcw-send-btn {
      margin: 0 0 0 8px;
      padding: 9px 16px;
      background: transparent;
      font-weight: 700;
      color: var(--bcw-primary-text);
      border: 1.5px solid var(--bcw-border);
      border-radius: 24px;
      cursor: pointer;
      transition: opacity 0.2s;
      font-family: var(--bcw-font);
      font-size: 14px;
      white-space: nowrap;
    }
    #bcw-send-btn:hover { opacity: 0.85; background: var(--bcw-primary); border-color: var(--bcw-primary);}
    #bcw-send-btn:disabled { background: #ccc; cursor: not-allowed; opacity: 0.7; }

    /* ── Collapse Button (in input area) ───────── */
    #bcw-collapse-btn {
      margin: 0 0 0 6px;
      padding: 0;
      width: 36px;
      height: 36px;
      background: transparent;
      border: 1.5px solid var(--bcw-border);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, border-color 0.2s;
      flex-shrink: 0;
    }
    #bcw-collapse-btn:hover {
      background: var(--bcw-bg);
      border-color: var(--bcw-primary);
    }
    #bcw-collapse-btn svg {
      width: 16px;
      height: 16px;
      fill: #666;
    }

    /* ── Avatar container ─────────────────────── */
    #avatar-widget-container {
      z-index: 2147483647 !important;
      opacity: 0 !important;
      transform: scale(0.8) !important;
      transform-origin: 150% 90%;
      transition: opacity 0.35s ease, transform 0.5s cubic-bezier(.4,0,.2,1);
      pointer-events: none;
    }
    #avatar-widget-container.bcw-avatar-visible {
      opacity: 1 !important;
      transform: scale(1) !important;
    }

    /* ── Responsive ────────────────────────────── */
    @media (max-width: 440px) {
      #bcw-panel {
        width: calc(100vw - 24px);
        right: -8px;
        bottom: 0;
        height: 75vh;
        border-radius: 14px;
      }
      #avatar-widget-container {
        transform-origin: 100% 90%;
      }
      #avatar-widget-container.bcw-avatar-visible {
        opacity: 0.7 !important;
      }
    }
  `;

    // ─── HTML Template ───────────────────────────────────────────────────
    const WIDGET_HTML = `
    <div id="bcw-panel">
      <div id="bcw-header">
        <img id="bcw-header-avatar" src="" alt="Bot" />
        <div id="bcw-header-info">
          <span id="bcw-header-title">${WIDGET_TITLE}</span>
          <div id="bcw-header-status">
            <span class="bcw-status-dot"></span>
            <span id="bcw-status-text">Connecting…</span>
          </div>
        </div>
        <div id="bcw-volume-group">
          <button id="bcw-volume-btn" title="Volume">
            <svg id="bcw-vol-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM412.6 181.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393 285.2 400 271.4 400 256s-7.1-29.2-17.8-37.2c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5z"/></svg>
            <svg id="bcw-mute-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="display:none"><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg>
          </button>
          <div id="bcw-volume-slider-wrap">
            <input type="range" id="bcw-volume-slider" min="0" max="100" value="100" />
          </div>
        </div>
        <button id="bcw-clear-btn" title="Clear Chat History">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
          </svg>
        </button>
      </div>
      <div id="bcw-messages"></div>
      <div id="bcw-input-area">
        <input type="text" id="bcw-input" placeholder="Connecting…" autocomplete="off" disabled />
        <button id="bcw-send-btn" disabled><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" fill="currentColor"><path d="M7.12,17,.55,13.36l0,0a1.06,1.06,0,0,1-.47-.95,1,1,0,0,1,.57-.88L23.76.08a.74.74,0,0,1,.51,0L7.1,17.07ZM7,18.57V24.3a.5.5,0,0,0,.88.32l4-4.88,4.92,2.76a1,1,0,0,0,.88.11,1,1,0,0,0,.64-.67L24.82,1a.78.78,0,0,0,0-.16Z"/></svg></button>
        <button id="bcw-collapse-btn" aria-label="Collapse chat" title="Collapse">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
          </svg>
        </button>
      </div>
    </div>
    <button id="bcw-fab" aria-label="Open chat">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M256 48C141.1 48 48 141.1 48 256c0 39.6 11.2 76.6 30.6 108.1L48.4 460.5c-2.7 8.6 5.5 16.8 14.1 14.1l96.4-30.2C190.4 463.4 222 474 256 474c114.9 0 208-93.1 208-208S370.9 48 256 48zM160 272a16 16 0 1 1 0-32 16 16 0 0 1 0 32zm96 0a16 16 0 1 1 0-32 16 16 0 0 1 0 32zm96 0a16 16 0 1 1 0-32 16 16 0 0 1 0 32z"/>
      </svg>
    </button>
  `;

    // ─── Inject DOM ────────────────────────────────────────────────────
    const styleEl = document.createElement('style');
    styleEl.textContent = WIDGET_CSS;
    document.head.appendChild(styleEl);

    const container = document.createElement('div');
    container.id = 'botnoi-chat-widget';
    container.innerHTML = WIDGET_HTML;
    document.body.appendChild(container);

    // ─── DOM References ──────────────────────────────────────────────────
    const fab = document.getElementById('bcw-fab');
    const panel = document.getElementById('bcw-panel');
    const inputEl = document.getElementById('bcw-input');
    const sendBtn = document.getElementById('bcw-send-btn');
    const collapseBtn = document.getElementById('bcw-collapse-btn');
    const messagesEl = document.getElementById('bcw-messages');
    const clearBtn = document.getElementById('bcw-clear-btn');
    const headerAvatar = document.getElementById('bcw-header-avatar');
    const headerTitle = document.getElementById('bcw-header-title');
    const statusDot = container.querySelector('.bcw-status-dot');
    const statusText = document.getElementById('bcw-status-text');
    const volumeBtn = document.getElementById('bcw-volume-btn');
    const volumeSlider = document.getElementById('bcw-volume-slider');
    const volIcon = document.getElementById('bcw-vol-icon');
    const muteIcon = document.getElementById('bcw-mute-icon');

    // ─── Volume Control ─────────────────────────────────────────────────
    let lastVolume = 100;
    let isMuted = false;

    function updateVolumeIcon(val) {
        if (val === 0) {
            volIcon.style.display = 'none';
            muteIcon.style.display = '';
        } else {
            volIcon.style.display = '';
            muteIcon.style.display = 'none';
        }
    }

    volumeSlider.addEventListener('input', function () {
        var val = parseInt(volumeSlider.value, 10);
        isMuted = val === 0;
        if (val > 0) lastVolume = val;
        updateVolumeIcon(val);
        if (window.WebAvatar) window.WebAvatar.setVolume(val / 100);
    });

    volumeBtn.addEventListener('click', function () {
        if (isMuted) {
            isMuted = false;
            volumeSlider.value = lastVolume;
            updateVolumeIcon(lastVolume);
            if (window.WebAvatar) window.WebAvatar.setVolume(lastVolume / 100);
        } else {
            isMuted = true;
            lastVolume = parseInt(volumeSlider.value, 10) || 100;
            volumeSlider.value = 0;
            updateVolumeIcon(0);
            if (window.WebAvatar) window.WebAvatar.setVolume(0);
        }
    });

    // ─── State ───────────────────────────────────────────────────────────
    let isOpen = false;
    let initialized = false;
    let ably = null;
    let channel = null;

    let hwid = localStorage.getItem('botnoi_hwid');
    if (!hwid) {
        hwid =
            window.crypto && window.crypto.randomUUID
                ? crypto.randomUUID().replace(/-/g, '')
                : Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
        localStorage.setItem('botnoi_hwid', hwid);
    }

    let sessionCount = parseInt(
        localStorage.getItem('botnoi_session_count') || '1',
        10
    );
    let userId = `user_${hwid}_${sessionCount}`;
    let chatHistory = JSON.parse(
        localStorage.getItem(`botnoi_history_${userId}`) || '[]'
    );

    // ─── Toggle Helpers ──────────────────────────────────────────────────
    let avatarReady = false;

    function showAvatar() {
        var el = document.getElementById('avatar-widget-container');
        if (!el || !avatarReady) return;
        // Double-rAF: ensures the browser has painted the hidden state
        // before adding the class that triggers the CSS transition
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                el.classList.add('bcw-avatar-visible');
            });
        });
    }
    function hideAvatar() {
        var el = document.getElementById('avatar-widget-container');
        if (el) el.classList.remove('bcw-avatar-visible');
    }

    function openPanel() {
        isOpen = true;
        panel.classList.add('bcw-visible');
        fab.classList.add('bcw-hidden');
        showAvatar();
        if (!initialized && !needsSetup) {
            initialized = true;
            loadAblyAndInit();
        } else if (needsSetup) {
            showSetupForm();
        } else {
            inputEl.focus();
        }
    }

    function closePanel() {
        isOpen = false;
        panel.classList.remove('bcw-visible');
        fab.classList.remove('bcw-hidden');
        hideAvatar();
    }

    fab.addEventListener('click', openPanel);
    collapseBtn.addEventListener('click', closePanel);
    document.getElementById('bcw-header').addEventListener('click', function (e) {
        // Don't close if clicking buttons or interactive elements inside the header
        if (e.target.closest('#bcw-clear-btn, #bcw-volume-group')) return;
        closePanel();
    });

    // ─── Setup Form ────────────────────────────────────────────────────────
    function showSetupForm() {
        // Hide normal chat elements
        messagesEl.style.display = 'none';
        document.getElementById('bcw-input-area').style.display = 'none';

        // Create form if not already present
        if (document.getElementById('bcw-setup-form')) return;

        var form = document.createElement('div');
        form.id = 'bcw-setup-form';
        form.innerHTML =
            '<span class="bcw-setup-title">Widget Setup</span>' +
            '<span class="bcw-setup-desc">Enter your credentials to connect the widget.</span>' +
            '<label>Avatar URL<input type="text" id="bcw-setup-avatar" value="' + AVATAR_MODEL + '" placeholder="e.g. Botnoi" /></label>' +
            (!BOT_ID ? '<label>Bot ID<input type="text" id="bcw-setup-botid" placeholder="e.g. 64464df59f76af17c9ca0ed3" /></label>' : '') +
            (!BNV_KEY ? '<label>Botnoi Voice Key<input type="text" id="bcw-setup-bnvkey" placeholder="e.g. b3FId29Ea3Rr..." /></label>' : '') +
            '<div class="bcw-toggle-row">' +
            '<span class="bcw-toggle-label">Speaker</span>' +
            '<div class="bcw-toggle-wrap">' +
            '<span id="bcw-v-label-1" class="' + (BNV_VERSION === 1 ? 'bcw-active' : '') + '">v1</span>' +
            '<label class="bcw-toggle">' +
            '<input type="checkbox" id="bcw-setup-version" ' + (BNV_VERSION === 2 ? 'checked' : '') + ' />' +
            '<span class="bcw-toggle-track"></span>' +
            '</label>' +
            '<span id="bcw-v-label-2" class="' + (BNV_VERSION === 2 ? 'bcw-active' : '') + '">v2</span>' +
            '</div>' +
            '</div>' +
            '<input type="text" id="bcw-setup-speaker" value="' + BNV_SPEAKER + '" placeholder="Speaker ID, e.g. 13" style="width:100%;padding:10px 12px;border:1.5px solid var(--bcw-border);border-radius:10px;font-size:13px;font-family:inherit;background:var(--bcw-bg);color:var(--bcw-secondary-text);outline:none;box-sizing:border-box" />' +
            '<p class="bcw-setup-error" id="bcw-setup-error"></p>' +
            '<button class="bcw-setup-submit" id="bcw-setup-go">Connect</button>';

        panel.insertBefore(form, messagesEl);

        // Toggle label highlight
        var verCheckbox = document.getElementById('bcw-setup-version');
        var vLabel1 = document.getElementById('bcw-v-label-1');
        var vLabel2 = document.getElementById('bcw-v-label-2');
        verCheckbox.addEventListener('change', function () {
            if (verCheckbox.checked) {
                vLabel1.classList.remove('bcw-active');
                vLabel2.classList.add('bcw-active');
            } else {
                vLabel1.classList.add('bcw-active');
                vLabel2.classList.remove('bcw-active');
            }
        });

        document.getElementById('bcw-setup-go').addEventListener('click', function () {
            var errEl = document.getElementById('bcw-setup-error');
            var bidInput = document.getElementById('bcw-setup-botid');
            var bkvInput = document.getElementById('bcw-setup-bnvkey');
            var avatarInput = document.getElementById('bcw-setup-avatar');
            var speakerInput = document.getElementById('bcw-setup-speaker');

            if (bidInput && !bidInput.value.trim()) {
                errEl.textContent = 'Bot ID is required.';
                return;
            }
            if (bkvInput && !bkvInput.value.trim()) {
                errEl.textContent = 'Botnoi Voice Key is required.';
                return;
            }

            if (bidInput) {
                BOT_ID = bidInput.value.trim();
                if (CONFIG_SAVE) localStorage.setItem('bcw_bot_id', BOT_ID);
            }
            if (bkvInput) {
                BNV_KEY = bkvInput.value.trim();
                if (CONFIG_SAVE) localStorage.setItem('bcw_bnv_key', BNV_KEY);
            }

            AVATAR_MODEL = (avatarInput && avatarInput.value.trim()) || 'Botnoi';
            BNV_VERSION = verCheckbox.checked ? 2 : 1;
            BNV_SPEAKER = speakerInput.value.trim() || '13';
            if (CONFIG_SAVE) {
                localStorage.setItem('bcw_avatar_url', AVATAR_MODEL);
                localStorage.setItem('bcw_bnv_version', String(BNV_VERSION));
                localStorage.setItem('bcw_bnv_speaker', BNV_SPEAKER);
            }

            // Remove form and restore chat UI
            needsSetup = false;
            form.remove();
            messagesEl.style.display = '';
            document.getElementById('bcw-input-area').style.display = '';

            // Proceed with normal init
            initialized = true;
            loadAblyAndInit();
        });
    }

    // ─── Lazy Load Ably SDK & Initialize ─────────────────────────────────
    function loadAblyAndInit() {
        var pending = 1; // at minimum Ably

        function onReady() {
            pending--;
            if (pending <= 0) initWidget();
        }

        // Load Ably
        if (window.Ably) {
            onReady();
        } else {
            var ablyScript = document.createElement('script');
            ablyScript.src = 'https://cdn.ably.com/lib/ably.min-1.js';
            ablyScript.onload = onReady;
            ablyScript.onerror = function () {
                inputEl.placeholder = 'Failed to load messaging library.';
            };
            document.head.appendChild(ablyScript);
        }

        // Load Avatar Widget (if enabled)
        if (AVATAR_ENABLED && !window.WebAvatar) {
            pending++;
            var avatarScript = document.createElement('script');
            avatarScript.src = 'https://webavatar.didthat.cc/avatar-widget.js';
            avatarScript.onload = onReady;
            avatarScript.onerror = function () {
                console.warn('[BotnoiChatWidget] Failed to load avatar widget.');
                onReady(); // proceed without avatar
            };
            document.head.appendChild(avatarScript);
        }
    }

    async function initWidget() {
        try {
            const response = await fetch(`${WORKER_URL}/api/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ botId: BOT_ID }),
            });

            const result = await response.json();

            if (!result.success) {
                inputEl.placeholder = 'Bot connection failed.';
                setStatus('offline', 'Offline');
                appendMsgElement(
                    createBubble(
                        'Error: The requested Bot ID does not exist or cannot be authorized.',
                        'bot'
                    )
                );
                return;
            }

            // Populate header with bot info
            if (result.bot_name) {
                headerTitle.textContent = result.bot_name;
            }
            if (result.bot_avatar) {
                headerAvatar.src = result.bot_avatar;
                headerAvatar.classList.add('bcw-show');
            }

            ably = new window.Ably.Realtime({
                authUrl: `${WORKER_URL}/api/auth`,
            });

            // Monitor Ably connection state for status indicator
            ably.connection.on(function (stateChange) {
                switch (stateChange.current) {
                    case 'connected':
                        setStatus('online', 'Online');
                        break;
                    case 'disconnected':
                    case 'suspended':
                        setStatus('offline', 'Disconnected');
                        break;
                    case 'closed':
                    case 'failed':
                        setStatus('offline', 'Offline');
                        break;
                    case 'connecting':
                        setStatus('', 'Connecting…');
                        break;
                }
            });

            connectToChannel();
            renderHistory();

            // Initialize avatar if enabled and loaded
            if (AVATAR_ENABLED && window.WebAvatar) {
                var isMobile = window.innerWidth <= 440;
                window.WebAvatar.init({
                    modelUrl: AVATAR_MODEL,
                    defaultAnimationUrl: 'Idleloop',
                    cameraTarget: { x: 0, y: 0, z: -2.0 },
                    offset: { x: isMobile ? 50 : 360, y: 90 },
                });
                // Listen for avatar-widget-ready event — fade in once model is rendered
                waitForAvatarReady();
            }

            inputEl.disabled = false;
            sendBtn.disabled = false;
            inputEl.placeholder = 'Type a message…';
            inputEl.focus();
        } catch (err) {
            inputEl.placeholder = 'Network error occurred.';
            setStatus('offline', 'Offline');
            console.error('[BotnoiChatWidget]', err);
        }
    }

    // ─── Avatar Load Detection ──────────────────────────────────────────
    function waitForAvatarReady() {
        var done = false;
        function onAvatarReady() {
            if (done) return;
            done = true;
            avatarReady = true;
            if (isOpen) showAvatar();
        }

        // Primary: listen for custom event from avatar-widget.js
        window.addEventListener('avatar-widget-ready', function onReady() {
            window.removeEventListener('avatar-widget-ready', onReady);
            onAvatarReady();
        });

        // Fallback: poll for console log message (in case hosted version lacks the event)
        var attempts = 0;
        var poll = setInterval(function () {
            attempts++;
            var el = document.getElementById('avatar-widget-container');
            if (el) {
                var canvas = el.querySelector('canvas');
                // Check for canvas + a rendered scene (Three.js draws to it)
                if (canvas && canvas.width > 0) {
                    // Wait an extra beat for the model to finish rendering
                    setTimeout(function () {
                        clearInterval(poll);
                        onAvatarReady();
                    }, 500);
                    clearInterval(poll); // stop polling immediately
                }
            }
            if (attempts >= 150) { // 30s timeout
                clearInterval(poll);
                onAvatarReady();
            }
        }, 200);
    }

    // ─── Status Helper ───────────────────────────────────────────────────
    function setStatus(state, label) {
        statusDot.className = 'bcw-status-dot';
        if (state === 'online') statusDot.classList.add('bcw-online');
        else if (state === 'offline') statusDot.classList.add('bcw-offline');
        statusText.textContent = label;
    }

    // ─── Ably Channel ────────────────────────────────────────────────────
    function connectToChannel() {
        channel = ably.channels.get(`chat-${userId}`);
        channel.subscribe('bot-reply', function (message) {
            const replies = JSON.parse(message.data);
            var ttsTexts = [];
            replies.forEach(function (reply) {
                handleBotReply(reply, true);
                // Collect speakable text from eligible reply types
                var extracted = extractSpeakableText(reply);
                if (extracted) ttsTexts.push(extracted);
            });
            // Speak all collected text as one utterance
            if (ttsTexts.length > 0) {
                speakText(ttsTexts.join(' '));
            }
        });
    }

    // ─── Persistence Helpers ─────────────────────────────────────────────
    function saveHistory() {
        localStorage.setItem(
            `botnoi_history_${userId}`,
            JSON.stringify(chatHistory)
        );
    }

    // ─── Clear Chat ──────────────────────────────────────────────────────
    clearBtn.addEventListener('click', function () {
        if (
            !confirm(
                'Are you sure you want to clear the chat history? This cannot be undone.'
            )
        )
            return;

        // 1. Clear chat messages from DOM and localStorage
        messagesEl.innerHTML = '';
        localStorage.removeItem(`botnoi_history_${userId}`);
        chatHistory = [];

        sessionCount++;
        localStorage.setItem('botnoi_session_count', sessionCount.toString());

        // Update userId now so it's correct even if we early-return below
        userId = `user_${hwid}_${sessionCount}`;

        // Reset header bot info and status
        headerTitle.textContent = WIDGET_TITLE;
        headerAvatar.src = '';
        headerAvatar.classList.remove('bcw-show');
        setStatus('offline', 'Offline');

        // 2. Disconnect Ably channel and close connection
        try {
            if (channel) {
                channel.unsubscribe();
                channel.detach();
            }
            if (ably) {
                if (channel) ably.channels.release(`chat-${userId}`);
                ably.close();
            }
        } catch (err) {
            console.warn('[BotnoiChatWidget] Ably cleanup:', err);
        } finally {
            ably = null;
            channel = null;
        }

        // 3. Disconnect avatar
        try {
            if (window.WebAvatar && typeof window.WebAvatar.disconnect === 'function') {
                window.WebAvatar.disconnect();
            }
        } catch (err) {
            console.warn('[BotnoiChatWidget] Avatar disconnect:', err);
        }
        hideAvatar();
        avatarReady = false;

        // 4. Reset input state
        inputEl.value = '';
        inputEl.disabled = true;
        inputEl.placeholder = 'Connecting…';
        sendBtn.disabled = true;

        // 5. Always clear credentials and return to setup form
        localStorage.removeItem('bcw_bot_id');
        localStorage.removeItem('bcw_bnv_key');
        localStorage.removeItem('bcw_bnv_version');
        localStorage.removeItem('bcw_bnv_speaker');
        localStorage.removeItem('bcw_avatar_url');
        BOT_ID = currentScript.getAttribute('data-bot-id') || '';
        BNV_KEY = currentScript.getAttribute('data-bnv-key') || '';
        BNV_VERSION = parseInt(currentScript.getAttribute('data-bnv-version') || '1', 10);
        BNV_SPEAKER = currentScript.getAttribute('data-bnv-speaker') || '13';
        AVATAR_MODEL = currentScript.getAttribute('data-avatar-url') || 'Botnoi';
        needsSetup = true;
        initialized = false;
        showSetupForm();
    });

    // ─── Rendering ───────────────────────────────────────────────────────
    function renderHistory() {
        messagesEl.innerHTML = '';
        chatHistory.forEach(function (item) {
            if (item.sender === 'user') {
                appendMsgElement(createBubble(item.uiText || item.text, 'user'));
            } else if (item.sender === 'bot') {
                handleBotReply(item.reply, false);
            }
        });
    }

    function handleBotReply(reply, saveToStorage) {
        if (saveToStorage) {
            chatHistory.push({ sender: 'bot', reply: reply });
            saveHistory();
        }

        switch (reply.type) {
            case 'text':
                appendMsgElement(createBubble(reply.text, 'bot'));
                break;
            case 'image':
                displayImage(reply.image.img_url, 'bot');
                break;
            case 'file':
                displayFile(reply.file_url, reply.file_name, 'bot');
                break;
            case 'location':
                displayLocation(
                    reply.location.address,
                    reply.location.latitude,
                    reply.location.longitude,
                    'bot'
                );
                break;
            case 'video':
                displayVideo(reply.video_url, reply.preview_image_url, 'bot');
                break;
            case 'audio':
                displayAudio(reply.audio_url, 'bot');
                break;
            case 'sticker':
                displayImage(reply.sticker.sticker_image_url, 'bot');
                break;
            case 'quick_reply':
                displayQuickReply(reply.quick_reply);
                break;
            case 'carousel':
                displayCarousel(reply.carousel_cards);
                break;
            case 'postback':
                if (reply.postback && reply.postback.data) {
                    appendMsgElement(createBubble(reply.postback.data, 'bot'));
                }
                break;
        }
    }

    function appendMsgElement(element) {
        var existing = messagesEl.querySelectorAll('.bcw-quick-replies');
        existing.forEach(function (el) {
            el.remove();
        });
        messagesEl.appendChild(element);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function createBubble(text, sender) {
        var div = document.createElement('div');
        div.className = 'bcw-msg bcw-' + sender + '-msg';
        div.textContent = text;
        return div;
    }

    function displayImage(url, sender) {
        var div = document.createElement('div');
        div.className = 'bcw-msg bcw-' + sender + '-msg';
        var img = document.createElement('img');
        img.src = url;
        div.appendChild(img);
        appendMsgElement(div);
        img.onload = function () {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        };
    }

    function displayFile(url, name, sender) {
        var div = document.createElement('div');
        div.className = 'bcw-msg bcw-' + sender + '-msg';
        div.innerHTML =
            '📄 <a href="' +
            url +
            '" target="_blank">' +
            (name || 'Download File') +
            '</a>';
        appendMsgElement(div);
    }

    function displayLocation(address, lat, lon, sender) {
        var div = document.createElement('div');
        div.className = 'bcw-msg bcw-' + sender + '-msg';
        div.innerHTML =
            '📍 <a href="https://maps.google.com/?q=' +
            lat +
            ',' +
            lon +
            '" target="_blank">' +
            (address || 'View Location') +
            '</a>';
        appendMsgElement(div);
    }

    function displayVideo(url, poster, sender) {
        var div = document.createElement('div');
        div.className = 'bcw-msg bcw-' + sender + '-msg';
        div.innerHTML =
            '<video controls src="' +
            url +
            '" poster="' +
            (poster || '') +
            '"></video>';
        appendMsgElement(div);
    }

    function displayAudio(url, sender) {
        var div = document.createElement('div');
        div.className = 'bcw-msg bcw-' + sender + '-msg';
        div.innerHTML = '<audio controls src="' + url + '"></audio>';
        appendMsgElement(div);
    }

    function displayQuickReply(qrData) {
        if (qrData.text) {
            appendMsgElement(createBubble(qrData.text, 'bot'));
        }
        var qrContainer = document.createElement('div');
        qrContainer.className = 'bcw-quick-replies';

        qrData.quick_reply_choices.forEach(function (choice) {
            var btn = document.createElement('button');
            btn.className = 'bcw-quick-reply-btn';
            btn.textContent = choice.label;
            btn.onclick = function () {
                sendMessage(choice.data, choice.label);
            };
            qrContainer.appendChild(btn);
        });

        appendMsgElement(qrContainer);
    }

    function displayCarousel(cards) {
        var carouselContainer = document.createElement('div');
        carouselContainer.className = 'bcw-carousel-container';

        cards.forEach(function (card) {
            var cardEl = document.createElement('div');
            cardEl.className = 'bcw-carousel-card';

            var html = '';
            if (card.image_url)
                html +=
                    '<img src="' +
                    card.image_url +
                    '" class="bcw-carousel-img" alt="' +
                    (card.title || 'Card image') +
                    '">';
            html += '<div class="bcw-carousel-body">';
            if (card.title)
                html += '<div class="bcw-carousel-title">' + card.title + '</div>';
            if (card.subtitle)
                html +=
                    '<div class="bcw-carousel-subtitle">' + card.subtitle + '</div>';

            cardEl.innerHTML = html;
            var bodyEl = cardEl.querySelector('.bcw-carousel-body');

            if (card.buttons) {
                card.buttons.forEach(function (btnData) {
                    var buttonEl = document.createElement('button');
                    buttonEl.className = 'bcw-carousel-btn';
                    buttonEl.textContent = btnData.label;
                    buttonEl.onclick = function () {
                        if (btnData.type === 'web_url')
                            window.open(btnData.data, '_blank');
                        else if (btnData.type === 'phone')
                            window.location.href = 'tel:' + btnData.data;
                        else if (btnData.type === 'postback' || btnData.type === 'text')
                            sendMessage(btnData.data, btnData.label);
                    };
                    bodyEl.appendChild(buttonEl);
                });
            }
            carouselContainer.appendChild(cardEl);
        });

        appendMsgElement(carouselContainer);
    }

    // ─── Send Message ────────────────────────────────────────────────────
    async function sendMessage(payloadText, uiText) {
        var textToSend = payloadText || inputEl.value.trim();
        if (!textToSend) return;

        var displayText = uiText || textToSend;
        appendMsgElement(createBubble(displayText, 'user'));

        chatHistory.push({ sender: 'user', text: textToSend, uiText: displayText });
        saveHistory();

        inputEl.value = '';

        try {
            await fetch(`${WORKER_URL}/api/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, botId: BOT_ID, text: textToSend }),
            });
        } catch (err) {
            console.error('[BotnoiChatWidget] Send error:', err);
        }
    }

    sendBtn.addEventListener('click', function () {
        sendMessage();
    });
    inputEl.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });

    // ─── TTS: Text Sanitisation & Audio Generation ───────────────────────
    function sanitizeForTTS(text) {
        if (!text) return '';
        // Strip URLs
        var cleaned = text.replace(/https?:\/\/[^\s]+/gi, '');
        // Strip markdown-style links [text](url)
        cleaned = cleaned.replace(/\[([^\]]*)]\([^)]*\)/g, '$1');
        // Strip HTML tags
        cleaned = cleaned.replace(/<[^>]*>/g, '');
        // Collapse whitespace
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        return cleaned;
    }

    function extractSpeakableText(reply) {
        // Only extract text from 'text' and 'quick_reply' (the prompt text) and 'postback'
        // Ignore: image, file, location, video, audio, sticker, carousel
        switch (reply.type) {
            case 'text':
                return sanitizeForTTS(reply.text);
            case 'quick_reply':
                return reply.quick_reply && reply.quick_reply.text
                    ? sanitizeForTTS(reply.quick_reply.text)
                    : '';
            case 'postback':
                return reply.postback && reply.postback.data
                    ? sanitizeForTTS(reply.postback.data)
                    : '';
            default:
                return '';
        }
    }

    var ttsQueue = [];
    var ttsBusy = false;

    function speakText(text) {
        if (!BNV_KEY || !text) return;
        ttsQueue.push(text);
        if (!ttsBusy) processNextTTS();
    }

    async function processNextTTS() {
        if (ttsQueue.length === 0) { ttsBusy = false; return; }
        ttsBusy = true;
        var text = ttsQueue.shift();

        var endpoint = BNV_VERSION === 2
            ? 'https://api-voice.botnoi.ai/openapi/v1/generate_audio_v2'
            : 'https://api-voice.botnoi.ai/openapi/v1/generate_audio';

        try {
            var res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Botnoi-Token': BNV_KEY,
                },
                body: JSON.stringify({
                    text: text,
                    speaker: BNV_SPEAKER,
                    volume: 1,
                    speed: 1,
                    type_media: 'mp3',
                    save_file: 'true',
                    language: 'th',
                    page: 'user',
                }),
            });

            if (res.ok) {
                var data = await res.json();
                if (data.audio_url && window.WebAvatar) {
                    // Wait for previous audio to finish before playing next
                    window.WebAvatar.playAudio(data.audio_url);
                }
            } else {
                console.warn('[BotnoiChatWidget] TTS API error:', res.status);
            }
        } catch (err) {
            console.warn('[BotnoiChatWidget] TTS fetch error:', err);
        }

        // Small delay then process next in queue
        setTimeout(processNextTTS, 300);
    }
})();
