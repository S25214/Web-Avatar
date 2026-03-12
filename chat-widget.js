(()=>{var Lt=Object.defineProperty;var $t=(e,t)=>()=>(e&&(t=e(e=0)),t);var At=(e,t)=>{for(var i in t)Lt(e,i,{get:t[i],enumerable:!0})};var mt={};At(mt,{_getAudioCache:()=>_t,_setAudioCache:()=>Rt,clearAudioCache:()=>et,fetchAndCacheAudio:()=>tt});function Z(){return D?Promise.resolve(D):new Promise(function(e,t){var i=indexedDB.open("bcw-audio-cache",1);i.onupgradeneeded=function(a){a.target.result.createObjectStore("audio")},i.onsuccess=function(a){D=a.target.result,e(D)},i.onerror=function(){t(i.error)}})}function _t(e){return Z().then(function(t){return new Promise(function(i){var a=t.transaction("audio","readonly").objectStore("audio").get(e);a.onsuccess=function(){i(a.result||null)},a.onerror=function(){i(null)}})}).catch(function(){return null})}function Rt(e,t){return Z().then(function(i){return new Promise(function(a,o){var d=i.transaction("audio","readwrite");d.objectStore("audio").put(t,e),d.oncomplete=a,d.onerror=o})}).catch(function(){})}async function tt(e){return e}function et(){Z().then(function(e){try{var t=e.transaction("audio","readwrite");t.objectStore("audio").clear()}catch{}}).catch(function(){})}var D,U=$t(()=>{D=null});var pt=`
    :root {
      --bcw-primary: #a7e6ff;
      --bcw-primary-text: #272525;
      --bcw-secondary: #555;
      --bcw-secondary-text: #fff;
      --bcw-title-text: #333;
      --bcw-primary-subtitle-text: #666;
      --bcw-status-text: #999;
      --bcw-bg: #eee;
      --bcw-surface: #fff;
      --bcw-border: #e0e0e0;
      --bcw-danger: #dc3545;
      --bcw-font: 'Segoe UI', system-ui, -apple-system, sans-serif;
      --bcw-fab-size: 56px;
    }

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

    #bcw-fab {
      width: var(--bcw-fab-size);
      height: var(--bcw-fab-size);
      border-radius: 50%;
      background: var(--bcw-primary);
      color: var(--bcw-title-text);
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
      transform: scale(0.85) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.4s cubic-bezier(.34,1.56,.64,1), opacity 0.3s ease;
    }
    #bcw-panel.bcw-visible {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

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
      color: var(--bcw-title-text);
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
      color: var(--bcw-status-text);
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
    #bcw-clear-btn svg { width: 16px; height: 16px; fill: var(--bcw-title-text); }
    #bcw-clear-btn:hover svg { fill: var(--bcw-danger); }

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
    #bcw-volume-btn svg { width: 16px; height: 16px; fill: var(--bcw-title-text); }
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
      background: var(--bcw-title-text);
      cursor: pointer;
      margin-top: -4px;
    }
    #bcw-volume-slider::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--bcw-title-text);
      cursor: pointer;
      border: none;
    }

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
      background: var(--bcw-bg);
    }
    #bcw-setup-form .bcw-setup-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--bcw-title-text);
      text-align: center;
    }
    #bcw-setup-form .bcw-setup-desc {
      font-size: 12px;
      color: var(--bcw-title-text);
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
      color: var(--bcw-title-text);
    }
    #bcw-setup-form input[type="text"] {
      width: 100%;
      padding: 10px 12px;
      border: 1.5px solid var(--bcw-border);
      border-radius: 10px;
      font-size: 13px;
      font-family: inherit;
      background: #fff;
      color: var(--bcw-title-text);
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
      color: var(--bcw-title-text);
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
    .bcw-toggle-wrap .bcw-active { color: var(--bcw-title-text); }
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
      background: var(--bcw-primary);
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
    #bcw-messages-outer {
      flex: 1;
      overflow: hidden;
      background: var(--bcw-bg);
      min-height: 0;
    }
    #bcw-messages {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: 16px;
      box-sizing: border-box;
      background: var(--bcw-bg);
      display: flex;
      flex-direction: column;
      scroll-behavior: smooth;
      overscroll-behavior-y: none;
    }
    #bcw-messages::-webkit-scrollbar { width: 4px; }
    #bcw-messages::-webkit-scrollbar-track { background: transparent; }
    #bcw-messages::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0);
      border-radius: 10px;
      transition: background 0.3s;
    }
    #bcw-messages.bcw-scrolling::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); }

    #botnoi-chat-widget .bcw-msg {
      margin: 0 0 10px 0;
      padding: 5px 10px;
      border-radius: 18px;
      max-width: 80%;
      word-wrap: break-word;
      font-size: 14px;
      line-height: 1.45;
      list-style: none;
      opacity: 0;
      transform: translateY(8px) scale(0.97);
      transition: opacity 0.45s cubic-bezier(.22,.61,.36,1),
                  transform 0.55s cubic-bezier(.34,1.4,.64,1);
    }
    #botnoi-chat-widget .bcw-msg.bcw-animate-in {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    #botnoi-chat-widget .bcw-user-msg {
      background: var(--bcw-secondary);
      color: var(--bcw-secondary-text);
      margin-left: auto;
      margin-right: 0;
      border-bottom-right-radius: 4px;
      transform: translateX(14px) scale(0.97);
    }
    #botnoi-chat-widget .bcw-user-msg.bcw-animate-in {
      transform: translateX(0) scale(1);
    }
    #botnoi-chat-widget .bcw-bot-msg {
      background: var(--bcw-primary);
      color: var(--bcw-primary-text);
      margin-right: auto;
      margin-left: 0;
      border-bottom-left-radius: 4px;
      transform: translateX(-14px) scale(0.97);
      position: relative;
    }
    #botnoi-chat-widget .bcw-bot-msg.bcw-animate-in {
      transform: translateX(0) scale(1);
    }

    #botnoi-chat-widget .bcw-replay-btn {
      position: absolute;
      bottom: 0px;
      right: -20px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--bcw-surface);
      border: 1px solid var(--bcw-border);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s, background 0.2s;
      padding: 0;
      box-shadow: 0 1px 4px rgba(0,0,0,0.10);
      z-index: 1;
    }
    #botnoi-chat-widget .bcw-bot-msg:hover .bcw-replay-btn,
    #botnoi-chat-widget .bcw-bot-msg.bcw-replay-hover .bcw-replay-btn,
    #botnoi-chat-widget .bcw-bot-msg.bcw-row-hover .bcw-replay-btn {
      opacity: 1;
      pointer-events: auto;
    }
    #botnoi-chat-widget .bcw-replay-btn:hover {
      background: var(--bcw-primary);
    }
    #botnoi-chat-widget .bcw-replay-btn svg {
      width: 10px;
      height: 10px;
      fill: var(--bcw-title-text);
      flex-shrink: 0;
    }
    @keyframes bcw-shrinkOut {
      0%   { opacity: 1; max-height: 200px; margin-bottom: 10px; padding-top: 5px; padding-bottom: 5px; transform: scale(1); }
      30%  { opacity: 0.6; }
      100% { opacity: 0; max-height: 0;   margin-bottom: 0;   padding-top: 0;   padding-bottom: 0;   transform: scale(0.92); }
    }
    .bcw-msg.bcw-removing,
    .bcw-error-msg.bcw-removing,
    .bcw-warning-msg.bcw-removing {
      overflow: hidden;
      animation: bcw-shrinkOut 0.45s cubic-bezier(.4,0,.2,1) forwards;
      pointer-events: none;
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

    @keyframes bcw-fadeIn {
      from { opacity: 0; transform: translateY(8px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

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
      color: var(--bcw-title-text);
      border-radius: 20px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      font-family: var(--bcw-font);
      opacity: 0;
      transform: translateY(6px) scale(0.95);
      transition: background 0.2s, color 0.2s,
                  opacity 0.25s ease var(--bcw-btn-delay, 0ms),
                  transform 0.3s cubic-bezier(.34,1.4,.64,1) var(--bcw-btn-delay, 0ms);
    }
    #botnoi-chat-widget .bcw-quick-reply-btn.bcw-animate-in {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    #botnoi-chat-widget .bcw-quick-reply-btn:hover {
      background: var(--bcw-primary);
    }

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
      border: 1px solid var(--bcw-primary);
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
      color: var(--bcw-primary-text);
    }
    #botnoi-chat-widget .bcw-carousel-subtitle {
      font-size: 12px;
      color: var(--bcw-primary-subtitle-text);
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
      color: var(--bcw-title-text);
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: background 0.2s;
      font-family: var(--bcw-font);
    }
    #botnoi-chat-widget .bcw-carousel-btn:hover { background: var(--bcw-primary); }

    #bcw-input-area {
      display: flex;
      align-items: center;
      border-top: 1px solid var(--bcw-border);
      padding: 10px 12px;
      margin: 0;
      background: var(--bcw-surface);
      flex-shrink: 0;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      will-change: transform;
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
      color: var(--bcw-title-text);
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
      fill: var(--bcw-title-text);
    }

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

    @keyframes bcw-fadeOut {
      0%   { opacity: 1; transform: translateY(0); }
      70%  { opacity: 1; }
      100% { opacity: 0; transform: translateY(-6px); }
    }
    .bcw-error-msg,
    .bcw-warning-msg {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin: 0 0 10px 0;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.4;
      max-width: 92%;
      word-wrap: break-word;
      align-self: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      animation: bcw-fadeIn 0.25s ease;
    }
    .bcw-error-msg {
      background: #fff0f0;
      border: 1.5px solid #f87171;
      color: #b91c1c;
    }
    .bcw-error-msg::before {
      content: '\u26A0';
      font-size: 15px;
      flex-shrink: 0;
      line-height: 1.35;
    }
    .bcw-warning-msg {
      background: #fffbea;
      border: 1.5px solid #fbbf24;
      color: #92400e;
    }
    .bcw-warning-msg::before {
      content: '\u26A0';
      font-size: 15px;
      flex-shrink: 0;
      line-height: 1.35;
    }
    .bcw-warning-msg.bcw-fading {
      animation: bcw-fadeOut 1s ease forwards;
    }

    #botnoi-chat-widget .bcw-flex-msg.chatbox,
    #botnoi-chat-widget .bcw-flex-msg.chatbox * {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      user-select: text !important;
    }
    #botnoi-chat-widget .bcw-flex-msg.chatbox {
      display: block !important;
      width: auto !important;
      max-width: 100% !important;
      background-color: transparent !important;
      padding: 0 !important;
      flex: none !important;
      margin: 0 0 10px 0;
      opacity: 0;
      transform: translateX(-14px) scale(0.97);
      transition: opacity 0.45s cubic-bezier(.22,.61,.36,1),
                  transform 0.55s cubic-bezier(.34,1.4,.64,1);
    }
    #botnoi-chat-widget .bcw-flex-msg.bcw-animate-in {
      opacity: 1;
      transform: translateX(0) scale(1);
    }

    #botnoi-chat-widget .bcw-flex-msg .LySlider {
      display: block;
      overflow-x: auto;
      overflow-y: visible;
    }
    #botnoi-chat-widget .bcw-flex-msg .LySlider .lyInner {
      display: flex;
      flex-direction: row;
      width: 100%;
    }

    #botnoi-chat-widget .bcw-flex-msg .LySlider .lyItem {
      flex: none;
      width: 80%;
      max-width: 300px;
    }
    #botnoi-chat-widget .bcw-flex-msg .LySlider .lyItem.LyGi { max-width: 480px; }
    #botnoi-chat-widget .bcw-flex-msg .LySlider .lyItem.LyMe { max-width: 300px; }

    #botnoi-chat-widget .bcw-flex-msg .T1 {
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden;
    }

    #botnoi-chat-widget .bcw-flex-msg .T1 .t1Header,
    #botnoi-chat-widget .bcw-flex-msg .T1 .t1Hero {
      display: flex !important;
      flex-direction: column !important;
      flex: none !important;
    }
    #botnoi-chat-widget .bcw-flex-msg .T1 .t1Body {
      display: flex !important;
      flex-direction: column !important;
      flex: 1 0 auto !important;
    }
    #botnoi-chat-widget .bcw-flex-msg .T1 .t1Footer {
      display: flex !important;
      flex-direction: column !important;
      flex: none !important;
    }

    #botnoi-chat-widget .bcw-flex-msg .ExMgnTXxs { margin-top:  2px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnTXs  { margin-top:  4px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnTSm  { margin-top:  6px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnTMd  { margin-top:  8px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnTLg  { margin-top: 10px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnTXl  { margin-top: 12px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnTXxl { margin-top: 14px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLXxs { margin-left:  2px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLXs  { margin-left:  4px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLSm  { margin-left:  6px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLMd  { margin-left:  8px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLLg  { margin-left: 10px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLXl  { margin-left: 12px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLXxl { margin-left: 14px !important; }

    #botnoi-chat-widget .bcw-flex-msg .LySlider {
      zoom: 0.8;
    }
`;var A=document.currentScript||(function(){let e=document.getElementsByTagName("script");return e[e.length-1]})(),g={currentScript:A,AVATAR_WIDGET_SRC:A.getAttribute("data-avatar-widget-src")||"./avatar-widget.js",AUTO_FOCUS_INPUT:A.getAttribute("data-auto-focus-input")==="true",WORKER_URL:A.getAttribute("data-worker-url")||"https://botnoichatbot.didthat.workers.dev",WIDGET_TITLE:A.getAttribute("data-title")||"Botnoi Assistant",AVATAR_ENABLED:A.getAttribute("data-avatar")!=="false",CONFIG_SAVE:A.getAttribute("data-config-save")!=="false"};var It=`
    <div id="bcw-panel">
      <div id="bcw-header">
        <img id="bcw-header-avatar" src="" alt="Bot" />
        <div id="bcw-header-info">
          <span id="bcw-header-title">**TITLE_PLACEHOLDER**</span>
          <div id="bcw-header-status">
            <span class="bcw-status-dot"></span>
            <span id="bcw-status-text">Connecting\u2026</span>
          </div>
        </div>
        <div id="bcw-volume-group">
          <button id="bcw-volume-btn" title="Volume">
            <svg id="bcw-vol-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393 285.2 400 271.4 400 256s-7.1-29.2-17.8-37.2c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>
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
      <div id="bcw-messages-outer"><div id="bcw-messages"></div></div>
      <div id="bcw-input-area">
        <input type="text" id="bcw-input" placeholder="Connecting\u2026" autocomplete="off" disabled />
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
  `;function bt(){return It.replace("**TITLE_PLACEHOLDER**",g.WIDGET_TITLE)}var r={WORKER_URL:g.WORKER_URL,BOT_ID:g.currentScript.getAttribute("data-bot-id")||localStorage.getItem("bcw_bot_id")||"",AVATAR_MODEL:g.currentScript.getAttribute("data-avatar-url")||localStorage.getItem("bcw_avatar_url")||"Botnoi",BNV_KEY:g.currentScript.getAttribute("data-bnv-key")||localStorage.getItem("bcw_bnv_key")||"",BNV_VERSION:parseInt(g.currentScript.getAttribute("data-bnv-version")||localStorage.getItem("bcw_bnv_version")||"1",10),BNV_SPEAKER:g.currentScript.getAttribute("data-bnv-speaker")||localStorage.getItem("bcw_bnv_speaker")||"13",needsSetup:!1,isOpen:!1,initialized:!1,ably:null,channel:null,lastJWT:null,lastUserInput:"",hwid:"",sessionCount:1,userId:"",chatHistory:[],avatarReady:!1,avatarPoll:null,avatarListener:null};g.CONFIG_SAVE||(localStorage.removeItem("bcw_bot_id"),localStorage.removeItem("bcw_bnv_key"),localStorage.removeItem("bcw_bnv_version"),localStorage.removeItem("bcw_bnv_speaker"),localStorage.removeItem("bcw_avatar_url"),r.BOT_ID=g.currentScript.getAttribute("data-bot-id")||"",r.BNV_KEY=g.currentScript.getAttribute("data-bnv-key")||"",r.BNV_VERSION=parseInt(g.currentScript.getAttribute("data-bnv-version")||"1",10),r.BNV_SPEAKER=g.currentScript.getAttribute("data-bnv-speaker")||"13",r.AVATAR_MODEL=g.currentScript.getAttribute("data-avatar-url")||"Botnoi");r.needsSetup=!r.BOT_ID;r.hwid=localStorage.getItem("botnoi_hwid");r.hwid||(r.hwid=window.crypto&&window.crypto.randomUUID?crypto.randomUUID().replace(/-/g,""):Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15),localStorage.setItem("botnoi_hwid",r.hwid));r.sessionCount=parseInt(localStorage.getItem("botnoi_session_count")||"1",10);r.userId=`WebAvatarUser_${r.hwid}_${r.sessionCount}`;r.chatHistory=JSON.parse(localStorage.getItem(`botnoi_history_${r.userId}`)||"[]");function F(){localStorage.setItem(`botnoi_history_${r.userId}`,JSON.stringify(r.chatHistory))}var n={fab:null,panel:null,inputEl:null,sendBtn:null,collapseBtn:null,messagesEl:null,messagesOuterEl:null,clearBtn:null,headerAvatar:null,headerTitle:null,statusDot:null,statusText:null,volumeBtn:null,volumeSlider:null,volIcon:null,muteIcon:null};function q(){let e=document.getElementById("avatar-widget-container");!e||!r.avatarReady||requestAnimationFrame(function(){requestAnimationFrame(function(){e.classList.add("bcw-avatar-visible")})})}function V(){let e=document.getElementById("avatar-widget-container");e&&e.classList.remove("bcw-avatar-visible")}U();function N(){n.messagesEl.scrollTo({top:n.messagesEl.scrollHeight,behavior:"smooth"})}function S(e,t){n.statusDot.className="bcw-status-dot",e==="online"?n.statusDot.classList.add("bcw-online"):e==="offline"&&n.statusDot.classList.add("bcw-offline"),n.statusText.textContent=t}function gt(e){var t=document.createElement("div");t.className="bcw-error-msg",t.style.opacity="0",t.style.transform="translateY(8px) scale(0.96)",t.style.transition="opacity 0.3s ease, transform 0.35s cubic-bezier(.34,1.4,.64,1)",t.appendChild(document.createTextNode(e)),n.messagesEl.appendChild(t),N(),requestAnimationFrame(function(){requestAnimationFrame(function(){t.style.opacity="1",t.style.transform="translateY(0) scale(1)"})})}function ut(e){var t=document.createElement("div");t.className="bcw-warning-msg",t.style.opacity="0",t.style.transform="translateY(8px) scale(0.96)",t.style.transition="opacity 0.3s ease, transform 0.35s cubic-bezier(.34,1.4,.64,1)",t.appendChild(document.createTextNode(e)),n.messagesEl.appendChild(t),N(),requestAnimationFrame(function(){requestAnimationFrame(function(){t.style.opacity="1",t.style.transform="translateY(0) scale(1)"})}),setTimeout(function(){t.classList.add("bcw-removing"),setTimeout(function(){t.parentNode&&t.parentNode.removeChild(t)},450)},4e3)}function $(e,t){var i=document.createElement("div");return i.className="bcw-msg bcw-"+t+"-msg",i.textContent=e,i}function k(e){var t=n.messagesEl.querySelectorAll(".bcw-quick-replies");t.forEach(function(i){i.parentNode&&i.parentNode.removeChild(i)}),n.messagesEl.appendChild(e),N(),requestAnimationFrame(function(){requestAnimationFrame(function(){e.classList.contains("bcw-msg")&&e.classList.add("bcw-animate-in")})})}function P(e,t){var i=document.createElement("div");i.className="bcw-msg bcw-"+t+"-msg";var a=document.createElement("img");a.src=e,i.appendChild(a),k(i),a.onload=function(){n.messagesEl.scrollTop=n.messagesEl.scrollHeight}}function it(e,t,i){var a=document.createElement("div");a.className="bcw-msg bcw-"+i+"-msg",a.innerHTML='\u{1F4C4} <a href="'+e+'" target="_blank">'+(t||"Download File")+"</a>",k(a)}function at(e,t,i,a){var o=document.createElement("div");o.className="bcw-msg bcw-"+a+"-msg",o.innerHTML='\u{1F4CD} <a href="https://maps.google.com/?q='+t+","+i+'" target="_blank">'+(e||"View Location")+"</a>",k(o)}function ot(e,t,i){var a=document.createElement("div");a.className="bcw-msg bcw-"+i+"-msg",a.innerHTML='<video controls src="'+e+'" poster="'+(t||"")+'"></video>',k(a)}function rt(e,t){var i=document.createElement("div");i.className="bcw-msg bcw-"+t+"-msg",i.innerHTML='<audio controls src="'+e+'"></audio>',k(i)}var Ct=0;function nt(e){if(typeof window.flex2html!="function"){console.warn("[BotnoiChatWidget] flex2html not loaded; skipping flex message.");return}var t=document.createElement("div");t.className="bcw-flex-msg chatbox";var i="bcw-flex-"+ ++Ct;t.id=i,n.messagesEl.appendChild(t),flex2html(i,{type:"flex",altText:"Flex Message",contents:e}),t.querySelectorAll("br").forEach(function(a){a.parentNode.removeChild(a)}),N(),requestAnimationFrame(function(){requestAnimationFrame(function(){t.classList.add("bcw-animate-in")})})}function dt(e,t){var i=document.createElement("div");i.className="bcw-carousel-container",e.forEach(function(a){var o=document.createElement("div");o.className="bcw-carousel-card";var d="";a.image_url&&(d+='<img src="'+a.image_url+'" class="bcw-carousel-img" alt="'+(a.title||"Card image")+'">'),d+='<div class="bcw-carousel-body">',a.title&&(d+='<div class="bcw-carousel-title">'+a.title+"</div>"),a.subtitle&&(d+='<div class="bcw-carousel-subtitle">'+a.subtitle+"</div>"),o.innerHTML=d;var s=o.querySelector(".bcw-carousel-body");a.buttons&&a.buttons.forEach(function(c){var b=document.createElement("button");b.className="bcw-carousel-btn",b.textContent=c.label,b.onclick=function(){c.type==="web_url"?window.open(c.data,"_blank"):c.type==="phone"?window.location.href="tel:"+c.data:(c.type==="postback"||c.type==="text")&&t(c.data,c.label)},s.appendChild(b)}),i.appendChild(o)}),k(i)}function st(e,t,i,a,o){var d=null;e.text&&(d=$(e.text,"bot"),d.dataset.bcwTtsText=i(e.text),a(d),k(d));var s=document.createElement("div");return s.className="bcw-quick-replies",e.quick_reply_choices.forEach(function(c,b){var l=document.createElement("button");l.className="bcw-quick-reply-btn",l.style.setProperty("--bcw-btn-delay",b*60+"ms"),l.textContent=c.label,l.onclick=function(){t(c.data,c.label)},s.appendChild(l)}),n.messagesEl.appendChild(s),N(),requestAnimationFrame(function(){requestAnimationFrame(function(){var c=s.querySelectorAll(".bcw-quick-reply-btn");c.forEach(function(b){b.classList.add("bcw-animate-in")})})}),d}async function ft(e,t){return(await fetch(`${e}/api/verify`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({botId:t})})).json()}async function wt(e,t,i,a){var o=await fetch(`${e}/api/send`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:t,botId:i,text:a})});if(o.ok)return o.json();throw new Error("Message send failed")}async function ht(e,t,i){return!e||!window.WebAvatar||typeof window.WebAvatar.loadAnimation!="function"?Promise.resolve(null):fetch("https://getanim-zb2xurnl2a-as.a.run.app",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e},body:JSON.stringify({app:"avatar",input:[{role:"user",content:t},{role:"bot",content:i}]})}).then(function(a){return a.ok?a.json():Promise.reject(a.status)}).then(function(a){return a.animation&&window.WebAvatar&&typeof window.WebAvatar.loadAnimation=="function"&&(window.WebAvatar.loadAnimation(a.animation),console.log("[BotnoiChatWidget] Animation selected:",a.animation)),a.animation||null}).catch(function(a){return console.warn("[BotnoiChatWidget] Animation API error:",a),null})}async function vt(e,t,i,a,o){var d="https://tts-zb2xurnl2a-as.a.run.app/tts",s=a===2?"botnoiv2":"botnoi",c=await fetch(d,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+i},body:JSON.stringify({bot_id:t,provider:s,text:e,speaker:o,volume:1,speed:1,type_media:"wav",save_file:"true",language:"th",page:"user"})});if(c.ok)return c.json();throw new Error("TTS Failed with status "+c.status)}U();function Y(e){if(n.messagesOuterEl.style.display="none",n.panel.querySelector("#bcw-input-area").style.display="none",n.panel.querySelector("#bcw-volume-group").style.display="none",n.panel.querySelector("#bcw-clear-btn").style.display="none",!n.panel.querySelector("#bcw-setup-form")){var t=r.AVATAR_MODEL;if(t&&(t.indexOf("http://")===0||t.indexOf("https://")===0)){var i=t.split("?")[0].split("/"),a=i[i.length-1]||i[i.length-2]||t;t=a.split(".")[0]||t}var o=document.createElement("div");o.id="bcw-setup-form",o.innerHTML='<span class="bcw-setup-title">Widget Setup</span><span class="bcw-setup-desc">Enter your credentials to connect the widget.</span><label><span style="display:flex;justify-content:space-between;align-items:center">Character'+(g.currentScript.getAttribute("data-avatar-url")?"":'<button id="bcw-browse-models" style="background:none;border:none;cursor:pointer;font-size:11px;opacity:0.7;text-decoration:underline;color:inherit;padding:0;font-family:inherit">Browse \u2192</button>')+'</span><input type="text" id="bcw-setup-avatar" value="'+t+'" placeholder="e.g. Botnoi" '+(g.currentScript.getAttribute("data-avatar-url")?'readonly disabled style="opacity:0.6;cursor:not-allowed;"':"")+" /></label>"+(r.BOT_ID?"":'<label><span style="display:flex;justify-content:space-between;align-items:center">Bot ID<a href="https://console.botnoi.ai/manage" target="_blank" rel="noopener" style="font-size:11px;opacity:0.7;text-decoration:underline;color:inherit">Get ID \u2192</a></span><input type="text" id="bcw-setup-botid" placeholder="e.g. 64464df59f76af17c9ca0ed3" /></label>')+(g.currentScript.getAttribute("data-bnv-speaker")?"":'<div class="bcw-toggle-row"><span class="bcw-toggle-label">Speaker</span><div class="bcw-toggle-wrap"><span id="bcw-v-label-1" class="'+(r.BNV_VERSION===1?"bcw-active":"")+'">v1</span><label class="bcw-toggle"><input type="checkbox" id="bcw-setup-version" '+(r.BNV_VERSION===2?"checked":"")+' /><span class="bcw-toggle-track"></span></label><span id="bcw-v-label-2" class="'+(r.BNV_VERSION===2?"bcw-active":"")+'">v2</span></div></div><input type="text" id="bcw-setup-speaker" value="'+r.BNV_SPEAKER+'" placeholder="Speaker ID, e.g. 13" style="width:100%;padding:10px 12px;border:1.5px solid var(--bcw-border);border-radius:10px;font-size:13px;font-family:inherit;background:#fff;color:var(--bcw-title-text);outline:none;box-sizing:border-box" />')+'<p class="bcw-setup-error" id="bcw-setup-error"></p><button class="bcw-setup-submit" id="bcw-setup-go">Connect</button>',n.panel.insertBefore(o,n.messagesOuterEl);var d=o.querySelector("#bcw-browse-models");d&&d.addEventListener("click",async function(l){if(l.preventDefault(),d.textContent="Loading\u2026",d.disabled=!0,window.WebAvatar||await new Promise(function(y){var h=document.createElement("script");h.src=g.AVATAR_WIDGET_SRC,h.onload=y,h.onerror=y,document.head.appendChild(h)}),window.WebAvatar&&typeof window.WebAvatar.preload=="function")try{await window.WebAvatar.preload()}catch{}d.textContent="Browse \u2192",d.disabled=!1;var x=window.WebAvatar&&typeof window.WebAvatar.getModels=="function"?await window.WebAvatar.getModels():[],p=o.querySelector("#bcw-setup-avatar"),f=x.length?`Available models:
\u2022 `+x.join(`
\u2022 `)+`

Enter a model name:`:`No models found.

Enter a model name:`,u=prompt(f,p?p.value:"");u!==null&&p&&(p.value=u.trim())});var s=o.querySelector("#bcw-setup-version"),c=o.querySelector("#bcw-v-label-1"),b=o.querySelector("#bcw-v-label-2");s&&s.addEventListener("change",function(){s.checked?(c.classList.remove("bcw-active"),b.classList.add("bcw-active")):(c.classList.add("bcw-active"),b.classList.remove("bcw-active"))}),o.querySelector("#bcw-setup-go").addEventListener("click",function(){var l=o.querySelector("#bcw-setup-error"),x=o.querySelector("#bcw-setup-botid"),p=o.querySelector("#bcw-setup-avatar"),f=o.querySelector("#bcw-setup-speaker");if(x&&!x.value.trim()){l.textContent="Bot ID is required.";return}x&&(r.BOT_ID=x.value.trim(),g.CONFIG_SAVE&&localStorage.setItem("bcw_bot_id",r.BOT_ID)),r.AVATAR_MODEL=p&&!p.disabled&&p.value.trim()||r.AVATAR_MODEL||"Botnoi",r.BNV_VERSION=s?s.checked?2:1:r.BNV_VERSION,r.BNV_SPEAKER=f?f.value.trim()||"13":r.BNV_SPEAKER,g.CONFIG_SAVE&&(localStorage.setItem("bcw_avatar_url",r.AVATAR_MODEL),localStorage.setItem("bcw_bnv_version",String(r.BNV_VERSION)),localStorage.setItem("bcw_bnv_speaker",r.BNV_SPEAKER)),r.needsSetup=!1,o.remove(),n.messagesOuterEl.style.display="",n.panel.querySelector("#bcw-input-area").style.display="",n.panel.querySelector("#bcw-volume-group").style.display="",n.panel.querySelector("#bcw-clear-btn").style.display="",r.initialized=!0,e&&e()})}}var yt=340,W=[],K=!1;function L(e){if(!e)return"";var t=e.replace(/https?:\/\/[^\s]+/gi,"");return t=t.replace(/\[([^\]]*)]\([^)]*\)/g,"$1"),t=t.replace(/<[^>]*>/g,""),t=t.replace(/\s+/g," ").trim(),t}function zt(e){switch(e.type){case"text":return L(e.text);case"quick_reply":return e.quick_reply&&e.quick_reply.text?L(e.quick_reply.text):"";case"postback":return e.postback&&e.postback.data?L(e.postback.data):"";default:return""}}function Xt(e,t){switch(t&&(r.chatHistory.push({sender:"bot",reply:e}),F()),e.type){case"text":{var i=$(e.text,"bot");return i.dataset.bcwTtsText=L(e.text),R(i),k(i),i}case"image":P(e.image.original_img_url,"bot");break;case"file":it(e.file_url,e.file_name,"bot");break;case"location":at(e.location.address,e.location.latitude,e.location.longitude,"bot");break;case"video":ot(e.video_url,e.preview_image_url,"bot");break;case"audio":rt(e.audio_url,"bot");break;case"sticker":P(e.sticker.sticker_image_url,"bot");break;case"quick_reply":return st(e.quick_reply,I,L,R,_);case"carousel":dt(e.carousel_cards,I);break;case"flex":nt(e.flex);break;case"postback":{if(e.postback&&e.postback.data){var a=$(e.postback.data,"bot");return a.dataset.bcwTtsText=L(e.postback.data),R(a),k(a),a}break}}return null}function Et(){r.channel=r.ably.channels.get(`chat-${r.userId}`),r.channel.subscribe("bot-reply",function(e){let i=JSON.parse(e.data).messages;var a=[];if(i.forEach(function(d){var s=zt(d);if(s){var c=d.type==="text"||d.type==="postback"||d.type==="quick_reply";a.push({text:s,reply:d,bubbleRef:c?{el:null}:null})}}),i.forEach(function(d,s){setTimeout(function(){var c=Xt(d,!0);if(c){for(var b=0;b<a.length;b++)if(a[b].reply===d&&a[b].bubbleRef&&!a[b].bubbleRef.el){a[b].bubbleRef.el=c;break}}},s*yt)}),a.length>0){var o=r.lastUserInput;setTimeout(function(){a.forEach(function(d){Ot(d.text,o,d.text,d.bubbleRef,d.reply)})},(i.length-1)*yt)}})}function Ot(e,t,i,a,o){!g.AVATAR_ENABLED||!e||(W.push({text:e,userInput:t||"",botText:i||e,bubbleRef:a||null,replyRef:o||null}),K||lt())}async function lt(){if(W.length===0){K=!1;return}K=!0;var e=W.shift();try{let d=await vt(e.text,r.BOT_ID,r.lastJWT,r.BNV_VERSION,r.BNV_SPEAKER);if(d&&d.content&&window.WebAvatar){var t=await ht(r.lastJWT,e.userInput,e.botText),i=await tt(d.content);if(i||(i=d.content),e.bubbleRef&&e.bubbleRef.el&&_(e.bubbleRef.el,d.content,t),e.replyRef){for(var a=null,o=r.chatHistory.length-1;o>=0;o--)if(r.chatHistory[o].sender==="bot"&&r.chatHistory[o].reply===e.replyRef){a=r.chatHistory[o];break}a&&(d.content&&(a.reply.audioUrl=d.content),t&&(a.reply.animName=t),F())}window.WebAvatar.playAudio(i)}}catch{ut("Voice generation failed or network error.")}setTimeout(lt,300)}function Mt(){W.length=0,K=!1,window.WebAvatar&&window.WebAvatar.stopAudio()}async function I(e,t){var i=e||n.inputEl.value.trim();if(i){var a=t||i;k($(a,"user")),r.chatHistory.push({sender:"user",text:i,uiText:a}),F(),n.inputEl.value="",r.lastUserInput=i;try{let o=await wt(r.WORKER_URL,r.userId,r.BOT_ID,i);o&&o.token&&(r.lastJWT=o.token)}catch(o){console.error("[BotnoiChatWidget] Send error:",o)}}}function R(e){if(!e.querySelector(".bcw-replay-btn")){var t=document.createElement("button");t.className="bcw-replay-btn",t.title="Replay",t.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393 285.2 400 271.4 400 256s-7.1-29.2-17.8-37.2c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>',t.addEventListener("click",function(i){i.stopPropagation(),Nt(e)}),e.addEventListener("touchstart",function(){e.classList.add("bcw-replay-hover"),clearTimeout(e._bcwReplayTimer),e._bcwReplayTimer=setTimeout(function(){e.classList.remove("bcw-replay-hover")},3e3)},{passive:!0}),e.appendChild(t)}}function _(e,t,i){e&&(t&&(e.dataset.bcwAudioUrl=t),i&&(e.dataset.bcwAnimName=i))}async function Nt(e){var t=e.dataset.bcwAudioUrl||"",i=e.dataset.bcwAnimName||"",a=e.dataset.bcwTtsText||"";if(Mt(),t&&window.WebAvatar){i&&typeof window.WebAvatar.loadAnimation=="function"&&window.WebAvatar.loadAnimation(i);let{_getAudioCache:d}=await Promise.resolve().then(()=>(U(),mt));var o=await d(t);window.WebAvatar.playAudio(o||t)}else a&&(W.push({text:a,userInput:"",botText:a,bubbleRef:null}),lt())}function Bt(){if(confirm("Are you sure you want to clear the chat history? This cannot be undone.")){n.messagesEl.innerHTML="",localStorage.removeItem(`botnoi_history_${r.userId}`),et(),r.chatHistory=[],r.sessionCount++,localStorage.setItem("botnoi_session_count",r.sessionCount.toString()),r.userId=`WebAvatarUser_${r.hwid}_${r.sessionCount}`,n.headerTitle.textContent=g.WIDGET_TITLE,n.headerAvatar.src="",n.headerAvatar.classList.remove("bcw-show"),S("offline","Offline"),ct();try{window.WebAvatar&&typeof window.WebAvatar.disconnect=="function"&&window.WebAvatar.disconnect()}catch{}V(),r.avatarReady=!1,n.inputEl.value="",n.inputEl.disabled=!0,n.inputEl.placeholder="Connecting\u2026",n.sendBtn.disabled=!0,localStorage.removeItem("bcw_bot_id"),localStorage.removeItem("bcw_bnv_version"),localStorage.removeItem("bcw_bnv_speaker"),localStorage.removeItem("bcw_avatar_url"),r.BOT_ID=g.currentScript.getAttribute("data-bot-id")||"",r.BNV_VERSION=parseInt(g.currentScript.getAttribute("data-bnv-version")||"1",10),r.BNV_SPEAKER=g.currentScript.getAttribute("data-bnv-speaker")||"13",r.AVATAR_MODEL=g.currentScript.getAttribute("data-avatar-url")||"Botnoi",r.needsSetup=!r.BOT_ID,r.initialized=!1,r.needsSetup?Y(()=>{r.initialized=!0,window.botnoiApp.loadAblyAndInit()}):(r.initialized=!0,window.botnoiApp.loadAblyAndInit())}}function kt(){n.messagesEl.innerHTML="",r.chatHistory.forEach(function(e){if(e.sender==="user"){var t=$(e.uiText||e.text,"user");t.classList.add("bcw-animate-in"),n.messagesEl.appendChild(t)}else e.sender==="bot"&&Pt(e.reply)}),n.messagesEl.scrollTop=n.messagesEl.scrollHeight}function Pt(e){switch(e.type){case"text":{var t=$(e.text,"bot");t.classList.add("bcw-animate-in"),t.dataset.bcwTtsText=L(e.text),R(t),_(t,e.audioUrl,e.animName),n.messagesEl.querySelectorAll(".bcw-quick-replies").forEach(function(o){o.parentNode&&o.parentNode.removeChild(o)}),n.messagesEl.appendChild(t);break}case"image":P(e.image&&(e.image.original_img_url||e.image.img_url),"bot");break;case"file":it(e.file_url,e.file_name,"bot");break;case"location":at(e.location.address,e.location.latitude,e.location.longitude,"bot");break;case"video":ot(e.video_url,e.preview_image_url,"bot");break;case"audio":rt(e.audio_url,"bot");break;case"sticker":P(e.sticker.sticker_image_url,"bot");break;case"quick_reply":{var i=st(e.quick_reply,I,L,R,_);i&&_(i,e.audioUrl,e.animName);break}case"carousel":dt(e.carousel_cards,I);break;case"flex":nt(e.flex);break;case"postback":if(e.postback&&e.postback.data){var a=$(e.postback.data,"bot");a.classList.add("bcw-animate-in"),a.dataset.bcwTtsText=L(e.postback.data),R(a),_(a,e.audioUrl,e.animName),n.messagesEl.querySelectorAll(".bcw-quick-replies").forEach(function(o){o.parentNode&&o.parentNode.removeChild(o)}),n.messagesEl.appendChild(a)}break}}function ct(){try{var e=null;if(r.channel){e=r.channel.name;try{r.channel.unsubscribe()}catch{}try{r.channel.detach()}catch{}}window._bcwAblyInstances&&window._bcwAblyInstances.length>0&&(window._bcwAblyInstances.forEach(function(t){if(t){try{e&&t.channels.release(e)}catch{}if(t.connection)try{t.connection.off()}catch{}try{t.close()}catch{}}}),window._bcwAblyInstances=[]),Mt()}catch(t){console.warn("[BotnoiChatWidget] Ably cleanup:",t)}finally{r.ably=null,r.channel=null}}var Tt=`@charset "UTF-8";

.chatbox * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0 solid transparent;
  font-size: 100%;
  font-weight: normal;
  font-style: normal;
  list-style: none;
}

.chatbox *::after,
.chatbox *::before {
  box-sizing: inherit;
}

.chatbox {
  background-color: #849ebf;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 100%;
  flex: 1 1 100%;
  padding-top: 50px;
  width: 500px;
  height: auto;
  line-height: 1.4;
  color: #444;
  font-family: -apple-system, "BlinkMacSystemFont", Helvetica, Roboto,
    Sans-Serif;
  font-size: 16px;
  -webkit-user-select: none;
  -webkit-text-size-adjust: none;
}

.chatbox a {
  -webkit-touch-callout: none;
}

.chatbox a:active,
.chatbox a:focus,
.chatbox a:hover,
.chatbox a:link,
.chatbox a:visited {
  text-decoration: none;
}

/* Global rules removed \u2014 use the .chatbox-scoped section above instead.
   This prevents font-size/font-weight/border resets from leaking outside
   of flex card containers into the rest of the host page. */
.LySlider {
  overflow: hidden;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
}

.LySlider::-webkit-scrollbar {
  display: none;
}

.LySlider .lyInner {
  display: -webkit-box;
  display: flex;
  width: 100%;
}

.LySlider .lyInner::after {
  -webkit-box-flex: 0;
  flex: none;
  content: "";
  display: block;
  width: 7px;
  height: 1px;
}

.LySlider .lyItem {
  -webkit-box-flex: 0;
  flex: none;
  display: inherit;
  width: 80%;
  max-width: 300px;
  margin-left: 7px;
}

.LySlider .lyItem+.lyItem {
  margin-left: 9px;
}

.LySlider .lyItem.LyGi {
  max-width: 500px;
}

.LySlider .lyItem.LyMe {
  max-width: 300px;
}

.LySlider .lyItem.LyKi {
  max-width: 260px;
}

.LySlider .lyItem.LyHe {
  max-width: 241px;
}

.LySlider .lyItem.LyDe {
  max-width: 220px;
}

.LySlider .lyItem.LyMi {
  max-width: 160px;
}

.LySlider .lyItem.LyNa {
  max-width: 120px;
}

.LySlider .T1 {
  -webkit-box-flex: 1;
  flex: 1 0 0;
}

@media (-webkit-min-device-pixel-ratio: 1) {
  .LySlider .T1 {
    width: 0;
  }
}

@media (-webkit-min-device-pixel-ratio: 1) and (min-width: 0.001vmax) {
  .LySlider .T1 {
    width: auto;
  }
}

@media (min-resolution: 1dpi) {
  .LySlider .T1 {
    width: auto;
  }
}

.LySlider .T1 .t1Header {
  -webkit-box-flex: 0;
  flex: none;
}

.LySlider .T1 .t1Hero {
  -webkit-box-flex: 0;
  flex: none;
}

.LySlider .T1 .t1Hero:last-child {
  border-radius: 0;
}

.LySlider .T1 .t1Body {
  -webkit-box-flex: 1;
  flex: 1 0 0;
  flex-basis: auto;
}

@media (-webkit-min-device-pixel-ratio: 1) {
  .LySlider .T1 .t1Body {
    width: 0;
  }
}

@media (-webkit-min-device-pixel-ratio: 1) and (min-width: 0.001vmax) {
  .LySlider .T1 .t1Body {
    width: auto;
  }
}

@media (min-resolution: 1dpi) {
  .LySlider .T1 .t1Body {
    width: auto;
  }
}

.LySlider .T1 .t1Body>.MdBx.vr {
  -webkit-box-flex: 1;
  flex: 1 0 0;
  flex-basis: auto;
}

.LyGi .T1 {
  border-radius: 5px;
  max-width: 500px;
  margin: 0 7px;
}

.LyMe .T1 {
  border-radius: 17px;
}

.LyKi .T1 {
  border-radius: 10px;
}

.LyHe .T1 {
  border-radius: 10px;
}

.LyDe .T1 {
  border-radius: 10px;
}

.LyMi .T1 {
  border-radius: 10px;
}

.LyNa .T1 {
  border-radius: 10px;
}

.T1 {
  border-radius: 17px;
  overflow: hidden;
  background-color: #ffffff;
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
}

.T1 .t1Body,
.T1 .t1Footer,
.T1 .t1Header,
.T1 .t1Hero {
  display: inherit;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
}

.T1 .t1Body>div,
.T1 .t1Footer>div,
.T1 .t1Header>div,
.T1 .t1Hero>div {
  flex-basis: auto;
}

.T1 .t1Hero:first-child,
.T1 .t1Hero:first-child .MdImg.ExFull,
.T1 .t1Hero:first-child .MdImg.ExFull>div,
.T1 .t1Hero:first-child .MdImg.ExFull>div>a,
.T1 .t1Hero:first-child .MdImg.ExFull>div>a>span {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.T1 .t1Hero:last-child,
.T1 .t1Hero:last-child .MdImg.ExFull,
.T1 .t1Hero:last-child .MdImg.ExFull>div,
.T1 .t1Hero:last-child .MdImg.ExFull>div>a,
.T1 .t1Hero:last-child .MdImg.ExFull>div>a>span {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.T1 .t1Hero:first-child .MdImg.ExFull>div>a>span,
.T1 .t1Hero:last-child .MdImg.ExFull>div>a>span {
  overflow: hidden;
}

.T1 .t1Header>.MdBx {
  padding: 20px;
}

.LyKi .T1 .t1Header>.MdBx {
  padding: 13px;
}

.LyHe .T1 .t1Header>.MdBx {
  padding: 11px 14px 13px;
}

.LyDe .T1 .t1Header>.MdBx {
  padding: 11px 14px 13px;
}

.LyMi .T1 .t1Header>.MdBx {
  padding: 10px;
}

.LyNa .T1 .t1Header>.MdBx {
  padding: 10px;
}

.T1 .t1Body>.MdBx {
  padding: 20px;
  padding-top: 19px;
}

.LyKi .T1 .t1Body>.MdBx {
  padding: 13px;
}

.LyHe .T1 .t1Body>.MdBx {
  padding: 11px 14px 13px;
}

.LyDe .T1 .t1Body>.MdBx {
  padding: 11px 14px 13px;
}

.LyMi .T1 .t1Body>.MdBx {
  padding: 10px;
}

.LyNa .T1 .t1Body>.MdBx {
  padding: 10px;
}

.T1 .t1Body.ExHasFooter>.MdBx {
  padding-bottom: 10px;
}

.LyKi .T1 .t1Body.ExHasFooter>.MdBx {
  padding-bottom: 17px;
}

.LyHe .T1 .t1Body.ExHasFooter>.MdBx {
  padding-bottom: 17px;
}

.LyDe .T1 .t1Body.ExHasFooter>.MdBx {
  padding-bottom: 17px;
}

.T1 .t1Footer>.MdBx {
  padding: 10px;
}

.fxLTR,
[dir="ltr"] {
  direction: ltr;
}

.fxRTL,
[dir="rtl"] {
  direction: rtl;
}

.MdBtn,
.MdBx,
.MdIco,
.MdImg,
.MdTxt,
[class*="MdSep"] {
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-flex: 1;
  flex: 1 0 0;
  min-width: 0;
  max-width: 100%;
}

@media (-webkit-min-device-pixel-ratio: 1) {

  .MdBtn,
  .MdBx,
  .MdIco,
  .MdImg,
  .MdTxt,
  [class*="MdSep"] {
    width: 0;
  }
}

@media (-webkit-min-device-pixel-ratio: 1) and (min-width: 0.001vmax) {

  .MdBtn,
  .MdBx,
  .MdIco,
  .MdImg,
  .MdTxt,
  [class*="MdSep"] {
    width: auto;
  }
}

@media (min-resolution: 1dpi) {

  .MdBtn,
  .MdBx,
  .MdIco,
  .MdImg,
  .MdTxt,
  [class*="MdSep"] {
    width: auto;
  }
}

.MdBx {
  overflow: hidden;
  position: relative;
}

.MdBx.vr>div {
  -webkit-box-flex: 0;
  flex: none;
  flex-basis: auto;
}

.MdBx.hr {
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-direction: row;
  width: 100%;
}

.MdBx.hr>div {
  overflow: hidden;
  -webkit-box-flex: 1;
  flex: 1 0 0;
}

@media (-webkit-min-device-pixel-ratio: 1) {
  .MdBx.hr>div {
    width: 0;
  }
}

@media (-webkit-min-device-pixel-ratio: 1) and (min-width: 0.001vmax) {
  .MdBx.hr>div {
    width: auto;
  }
}

@media (min-resolution: 1dpi) {
  .MdBx.hr>div {
    width: auto;
  }
}

.MdBx.hr>div.MdSep {
  overflow: visible;
}

.MdBx.hr>div.fl0 {
  width: auto;
}

.MdBx.hr>div.fl0.MdImg.ExFull {
  width: 100%;
}

.MdBx.hr>div[class*="MdSep"] {
  -webkit-box-flex: 0;
  flex: none;
}

.MdBx.hr.bl {
  -webkit-box-align: baseline;
  align-items: baseline;
}

.MdBx.hr>div.ExAbs {
  width: auto;
}

.MdBx.hr.ExAbs {
  width: auto;
}

.MdBx.hr.ExAbs>div {
  width: auto;
}

.ExAbs .MdBx.hr {
  width: auto;
}

.ExAbs .MdBx.hr>div {
  width: auto;
}

.T1 .MdBx.hr.spcXs>div {
  margin-left: 2px;
}

.T1 .MdBx.hr.spcSm>div {
  margin-left: 4px;
}

.T1 .MdBx.hr.spcMd>div {
  margin-left: 6px;
}

.T1 .MdBx.hr.spcLg>div {
  margin-left: 8px;
}

.T1 .MdBx.hr.spcXl>div {
  margin-left: 10px;
}

.T1 .MdBx.hr.spcXxl>div {
  margin-left: 12px;
}

.T1 .MdBx.hr>div.mdBxFiller,
.T1 .MdBx.hr>div.mdBxSpacer,
.T1 .MdBx.hr>div:first-child {
  margin-left: 0;
}

.T1.fxRTL .MdBx.hr>div {
  margin-left: 0;
}

.T1.fxRTL .MdBx.hr.spcXs>div {
  margin-right: 2px;
}

.T1.fxRTL .MdBx.hr.spcSm>div {
  margin-right: 4px;
}

.T1.fxRTL .MdBx.hr.spcMd>div {
  margin-right: 6px;
}

.T1.fxRTL .MdBx.hr.spcLg>div {
  margin-right: 8px;
}

.T1.fxRTL .MdBx.hr.spcXl>div {
  margin-right: 10px;
}

.T1.fxRTL .MdBx.hr.spcXxl>div {
  margin-right: 12px;
}

.T1.fxRTL .MdBx.hr>div.mdBxFiller,
.T1.fxRTL .MdBx.hr>div.mdBxSpacer,
.T1.fxRTL .MdBx.hr>div:first-child {
  margin-right: 0;
}

.MdBx.itms-jfcS {
  -webkit-box-pack: start;
  justify-content: flex-start;
}

.MdBx.itms-jfcE {
  -webkit-box-pack: end;
  justify-content: flex-end;
}

.MdBx.itms-jfcC {
  -webkit-box-pack: center;
  justify-content: center;
}

.MdBx.itms-jfcSB {
  -webkit-box-pack: justify;
  justify-content: space-between;
}

.MdBx.itms-jfcSA {
  justify-content: space-around;
}

.MdBx.itms-jfcSE {
  justify-content: space-evenly;
}

.MdBx.itms-algS {
  -webkit-box-align: start;
  align-items: flex-start;
}

.MdBx.itms-algE {
  -webkit-box-align: end;
  align-items: flex-end;
}

.MdBx.itms-algC {
  -webkit-box-align: center;
  align-items: center;
}

.MdBx.itms-algBL {
  -webkit-box-align: baseline;
  align-items: baseline;
}

.MdBx.itms-algSR {
  -webkit-box-align: stretch;
  align-items: stretch;
}

.MdBx.vr.spcXs>div {
  margin-top: 2px;
}

.MdBx.vr.spcSm>div {
  margin-top: 4px;
}

.MdBx.vr.spcMd>div {
  margin-top: 6px;
}

.MdBx.vr.spcLg>div {
  margin-top: 8px;
}

.MdBx.vr.spcXl>div {
  margin-top: 10px;
}

.MdBx.vr.spcXxl>div {
  margin-top: 12px;
}

.MdBx.vr>div.mdBxFiller,
.MdBx.vr>div.mdBxSpacer,
.MdBx.vr>div:first-child {
  margin-top: 0;
}

.MdBx>div.fl0 {
  -webkit-box-flex: 0 !important;
  flex: none !important;
}

.MdBx>div.fl1 {
  -webkit-box-flex: 1 !important;
  flex: 1 0 0 !important;
}

.MdBx>div.fl2 {
  -webkit-box-flex: 2 !important;
  flex: 2 0 0 !important;
}

.MdBx>div.fl3 {
  -webkit-box-flex: 3 !important;
  flex: 3 0 0 !important;
}

.MdBx>div.algS {
  -webkit-box-align: start;
  align-items: flex-start;
}

.MdBx>div.algE {
  -webkit-box-align: end;
  align-items: flex-end;
}

.MdBx>div.grvC {
  -webkit-box-pack: center;
  justify-content: center;
}

.MdBx>div.grvB {
  -webkit-box-pack: end;
  justify-content: flex-end;
}

.T1 .MdBx>div.mdBxFiller {
  -webkit-box-flex: 1;
  flex: 1 0 0;
}

@media (-webkit-min-device-pixel-ratio: 1) {
  .T1 .MdBx>div.mdBxFiller {
    width: 0;
  }
}

@media (-webkit-min-device-pixel-ratio: 1) and (min-width: 0.001vmax) {
  .T1 .MdBx>div.mdBxFiller {
    width: auto;
  }
}

@media (min-resolution: 1dpi) {
  .T1 .MdBx>div.mdBxFiller {
    width: auto;
  }
}

.MdBx>div.mdBxSpacer {
  -webkit-box-flex: 0;
  flex: none;
}

.MdBx.hr>div.mdBxSpacer {
  height: 1px;
}

.MdBx.hr>div.mdBxSpacer.spcXs {
  width: 2px;
}

.MdBx.hr>div.mdBxSpacer.spcSm {
  width: 4px;
}

.MdBx.hr>div.mdBxSpacer.spcMd {
  width: 6px;
}

.MdBx.hr>div.mdBxSpacer.spcLg {
  width: 8px;
}

.MdBx.hr>div.mdBxSpacer.spcXl {
  width: 10px;
}

.MdBx.hr>div.mdBxSpacer.spcXxl {
  width: 12px;
}

.MdBx.hr[class*="spc"]>div.mdBxSpacer+div {
  margin-left: 0;
}

.MdBx.hr>.MdSep {
  align-self: stretch;
}

.MdBx.vr>div.mdBxSpacer {
  width: 1px;
}

.MdBx.vr>div.mdBxSpacer.spcXs {
  height: 2px;
}

.MdBx.vr>div.mdBxSpacer.spcSm {
  height: 4px;
}

.MdBx.vr>div.mdBxSpacer.spcMd {
  height: 6px;
}

.MdBx.vr>div.mdBxSpacer.spcLg {
  height: 8px;
}

.MdBx.vr>div.mdBxSpacer.spcXl {
  height: 10px;
}

.MdBx.vr>div.mdBxSpacer.spcXxl {
  height: 12px;
}

.MdBx.vr>div.fl0 {
  -webkit-box-flex: 0 !important;
  flex: none !important;
}

.MdBx.vr>div.fl1 {
  -webkit-box-flex: 1 !important;
  flex: 1 0 auto !important;
}

.MdBx.vr>div.fl2 {
  -webkit-box-flex: 2 !important;
  flex: 2 0 auto !important;
}

.MdBx.vr>div.fl3 {
  -webkit-box-flex: 3 !important;
  flex: 3 0 auto !important;
}

.MdBx[class*="spc"]>div.mdBxSpacer+div {
  margin-top: 0;
}

[class*="MdSep"] {
  -webkit-box-flex: 0;
  flex: none;
  box-sizing: content-box;
  width: 100%;
  border: 0 solid #d4d6da;
}

.MdSep {
  position: relative;
  -webkit-box-flex: 0;
  flex: none;
}

.MdSep::before {
  box-sizing: content-box;
  content: "";
  display: block;
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 1px;
  border: inherit;
  border-top-width: 1px;
  -webkit-transform-origin: left top;
  transform-origin: left top;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.MdSep:last-child::before {
  margin-top: -1px;
  border-top-width: 0;
  border-bottom-width: 1px;
}

.fxRTL .MdSep::before {
  -webkit-transform-origin: right top;
  transform-origin: right top;
}

.MdSepB {
  border-top-width: 1px;
}

.MdBx.hr>div.MdSep::before {
  width: 1px;
  height: 100%;
  border-top-width: 0;
  border-left-width: 1px;
  -webkit-transform: scaleX(0.5);
  transform: scaleX(0.5);
}

.MdBx.hr>div.MdSep:last-child::before {
  margin-top: 0;
  margin-left: -1px;
  border-left-width: 0;
  border-right-width: 1px;
}

.MdBx.hr>div.MdSepB {
  border-top-width: 0;
  border-left-width: 1px;
}

.fxRTL .MdBx.hr>div.MdSep::before {
  border-left-width: 0;
  border-right-width: 1px;
}

.fxRTL .MdBx.hr>div.MdSep:last-child::before {
  margin-left: 0;
  margin-right: -1px;
  border-right-width: 0;
  border-left-width: 1px;
}

/* \u2500\u2500 ExMgnT: box/button/image margin-top (generated by ExMgnT+upperalldigit) */
.ExMgnTXxs {
  margin-top: 2px;
}

.ExMgnTXs {
  margin-top: 4px;
}

.ExMgnTSm {
  margin-top: 6px;
}

.ExMgnTMd {
  margin-top: 8px;
}

.ExMgnTLg {
  margin-top: 10px;
}

.ExMgnTXl {
  margin-top: 12px;
}

.ExMgnTXxl {
  margin-top: 14px;
}

.ExMgnTNone {
  margin-top: 0;
}

/* \u2500\u2500 ExMgnL: text margin-top (generated by ExMgnL+upperalldigit, applied
   to .MdTxt \u2014 the 'L' stands for 'leading' not 'left') */
.ExMgnLXxs {
  margin-top: 2px;
}

.ExMgnLXs {
  margin-top: 4px;
}

.ExMgnLSm {
  margin-top: 6px;
}

.ExMgnLMd {
  margin-top: 8px;
}

.ExMgnLLg {
  margin-top: 10px;
}

.ExMgnLXl {
  margin-top: 12px;
}

.ExMgnLXxl {
  margin-top: 14px;
}

.ExMgnLNone {
  margin-top: 0;
}

.MdTxt {
  position: relative;
}

.MdTxt p {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.MdTxt p:empty {
  height: 1.4em;
}

.MdTxt.ExWrap p {
  text-overflow: clip;
  word-wrap: break-word;
  white-space: normal;
}

.MdTxt.Ex2nd {
  color: #aaa;
}

.MdTxt.ExAlgC p {
  text-align: center;
}

.MdTxt.ExAlgE p {
  text-align: end;
}

.MdSpn {
  font-style: inherit;
  font-weight: inherit;
  text-decoration: inherit;
}

/* Size class names match what flex2html.js generates via upperalldigit()
   which uppercases ONLY the first character:
     xxs \u2192 Xxs,  xxl \u2192 Xxl,  3xl \u2192 3xl,  4xl \u2192 4xl,  5xl \u2192 5xl        */
.MdSpn.ExXxs {
  font-size: 11px;
}

.MdSpn.ExXs {
  font-size: 13px;
}

.MdSpn.ExSm {
  font-size: 14px;
}

.MdSpn.ExMd {
  font-size: 16px;
}

.MdSpn.ExLg {
  font-size: 19px;
}

.MdSpn.ExXl {
  font-size: 22px;
}

.MdSpn.ExXxl {
  font-size: 29px;
}

.MdSpn.Ex3xl {
  font-size: 35px;
}

.MdSpn.Ex4xl {
  font-size: 48px;
}

.MdSpn.Ex5xl {
  font-size: 74px;
}

/* MdTxt (text objects) size classes \u2014 MdTxt p has no default font-size
   so it inherits from .chatbox (16px). These explicit rules ensure the
   size field in the JSON is respected for full text objects. */
.MdTxt.ExXxs p {
  font-size: 11px;
}

.MdTxt.ExXs p {
  font-size: 13px;
}

.MdTxt.ExSm p {
  font-size: 14px;
}

.MdTxt.ExMd p {
  font-size: 16px;
}

.MdTxt.ExLg p {
  font-size: 19px;
}

.MdTxt.ExXl p {
  font-size: 22px;
}

.MdTxt.ExXxl p {
  font-size: 29px;
}

.MdTxt.Ex3xl p {
  font-size: 35px;
}

.MdTxt.Ex4xl p {
  font-size: 48px;
}

.MdTxt.Ex5xl p {
  font-size: 74px;
}

/* ExWB bold \u2014 .chatbox * resets font-weight:normal, explicit rules needed
   for both MdTxt and MdSpn so that weight:"bold" is respected. */
.MdTxt.ExWB p,
.MdSpn.ExWB {
  font-weight: bold;
}

.MdIco {
  position: relative;
}

.MdIco span {
  display: inline-block;
  overflow: hidden;
  background: no-repeat center;
  background-size: contain;
  width: 1em;
  height: 1em;
  vertical-align: baseline;
}

.MdIco.ExAr2to1 span {
  width: 2em;
}

.MdIco.ExAr3to1 span {
  width: 3em;
}

.MdIco.ExXXs,
.MdTxt.ExXXs {
  font-size: 11px;
}

.MdIco.ExXs,
.MdTxt.ExXs {
  font-size: 13px;
}

.MdIco.ExSm,
.MdTxt.ExSm {
  font-size: 14px;
}

.MdIco.ExMd,
.MdTxt.ExMd {
  font-size: 16px;
}

.MdIco.ExLg,
.MdTxt.ExLg {
  font-size: 19px;
}

.MdIco.ExXl,
.MdTxt.ExXl {
  font-size: 22px;
}

.MdIco.ExXXl,
.MdTxt.ExXXl {
  font-size: 29px;
}

.MdIco.Ex3Xl,
.MdTxt.Ex3Xl {
  font-size: 35px;
}

.MdIco.Ex4Xl,
.MdTxt.Ex4Xl {
  font-size: 48px;
}

.MdIco.Ex5Xl,
.MdTxt.Ex5Xl {
  font-size: 74px;
}

.MdBtn {
  position: relative;
}

.MdBtn a {
  display: inherit;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 16px;
}

.MdBtn div {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
}

.MdBtn.ExBtn1 a {
  background-color: #17c950;
  color: #ffffff;
}

.MdBtn.ExBtn2 a {
  background-color: #dcdfe5;
  color: #111111;
}

.MdBtn.ExBtnL a {
  color: #42659a;
}

.MdBtn.ExSm a {
  height: 40px;
}

.MdImg {
  -webkit-box-align: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.MdImg>div {
  max-width: 100%;
}

.MdImg a {
  display: block;
  position: relative;
  width: 100%;
}

.MdImg span {
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center center;
}

.MdImg.ExXXs>div {
  width: 40px;
}

.MdImg.ExXs>div {
  width: 60px;
}

.MdImg.ExSm>div {
  width: 80px;
}

.MdImg.ExMd>div {
  width: 100px;
}

.MdImg.ExLg>div {
  width: 120px;
}

.MdImg.ExXl>div {
  width: 140px;
}

.MdImg.ExXXl>div {
  width: 160px;
}

.MdImg.Ex3Xl>div {
  width: 180px;
}

.MdImg.Ex4Xl>div {
  width: 200px;
}

.MdImg.Ex5Xl>div {
  width: 220px;
}

.MdImg.ExFull>div {
  width: 100%;
}

.MdImg.ExAr1to1 a {
  padding-bottom: 100%;
}

.MdImg.ExAr1_51to1 a {
  padding-bottom: 66.22517%;
}

.MdImg.ExAr1_91to1 a {
  padding-bottom: 52.35602%;
}

.MdImg.ExAr20to13 a {
  padding-bottom: 65%;
}

.MdImg.ExAr4to3 a {
  padding-bottom: 75%;
}

.MdImg.ExAr16to9 a {
  padding-bottom: 56.25%;
}

.MdImg.ExAr2to1 a {
  padding-bottom: 50%;
}

.MdImg.ExAr3to1 a {
  padding-bottom: 33.33333%;
}

.MdImg.ExAr3to4 a {
  padding-bottom: 133.33333%;
}

.MdImg.ExAr9to16 a {
  padding-bottom: 177.77778%;
}

.MdImg.ExAr1to2 a {
  padding-bottom: 200%;
}

.MdImg.ExAr1to3 a {
  padding-bottom: 300%;
}

.MdImg.ExFit span {
  background-size: contain;
}

.MdImg.ExCover span {
  background-size: cover;
}

.MdImg.ExCircle span {
  border-radius: 50%;
}

.MdImg.ExMirrored span {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.MdImg.ExAbs.ExFull {
  width: 100%;
}

.ExMgnANone {
  margin: 0 !important;
}

.ExMgnAXs {
  margin: 2px !important;
}

.ExMgnASm {
  margin: 4px !important;
}

.ExMgnAMd {
  margin: 6px !important;
}

.ExMgnALg {
  margin: 8px !important;
}

.ExMgnAXl {
  margin: 10px !important;
}

.ExMgnAXXl {
  margin: 12px !important;
}

.ExMgnTNone {
  margin-top: 0 !important;
}

.ExMgnTXs {
  margin-top: 2px !important;
}

.ExMgnTSm {
  margin-top: 4px !important;
}

.ExMgnTMd {
  margin-top: 6px !important;
}

.ExMgnTLg {
  margin-top: 8px !important;
}

.ExMgnTXl {
  margin-top: 10px !important;
}

.ExMgnTXXl {
  margin-top: 12px !important;
}

.ExMgnBNone {
  margin-bottom: 0 !important;
}

.ExMgnBXs {
  margin-bottom: 2px !important;
}

.ExMgnBSm {
  margin-bottom: 4px !important;
}

.ExMgnBMd {
  margin-bottom: 6px !important;
}

.ExMgnBLg {
  margin-bottom: 8px !important;
}

.ExMgnBXl {
  margin-bottom: 10px !important;
}

.ExMgnBXXl {
  margin-bottom: 12px !important;
}

.ExMgnLNone {
  margin-left: 0 !important;
}

.ExMgnLXs {
  margin-left: 2px !important;
}

.ExMgnLSm {
  margin-left: 4px !important;
}

.ExMgnLMd {
  margin-left: 6px !important;
}

.ExMgnLLg {
  margin-left: 8px !important;
}

.ExMgnLXl {
  margin-left: 10px !important;
}

.ExMgnLXXl {
  margin-left: 12px !important;
}

.ExMgnRNone {
  margin-right: 0 !important;
}

.ExMgnRXs {
  margin-right: 2px !important;
}

.ExMgnRSm {
  margin-right: 4px !important;
}

.ExMgnRMd {
  margin-right: 6px !important;
}

.ExMgnRLg {
  margin-right: 8px !important;
}

.ExMgnRXl {
  margin-right: 10px !important;
}

.ExMgnRXXl {
  margin-right: 12px !important;
}

.ExPadANone {
  padding: 0 !important;
}

.ExPadAXs {
  padding: 2px !important;
}

.ExPadASm {
  padding: 4px !important;
}

.ExPadAMd {
  padding: 6px !important;
}

.ExPadALg {
  padding: 8px !important;
}

.ExPadAXl {
  padding: 10px !important;
}

.ExPadAXXl {
  padding: 12px !important;
}

.ExPadTNone {
  padding-top: 0 !important;
}

.ExPadTXs {
  padding-top: 2px !important;
}

.ExPadTSm {
  padding-top: 4px !important;
}

.ExPadTMd {
  padding-top: 6px !important;
}

.ExPadTLg {
  padding-top: 8px !important;
}

.ExPadTXl {
  padding-top: 10px !important;
}

.ExPadTXXl {
  padding-top: 12px !important;
}

.ExPadBNone {
  padding-bottom: 0 !important;
}

.ExPadBXs {
  padding-bottom: 2px !important;
}

.ExPadBSm {
  padding-bottom: 4px !important;
}

.ExPadBMd {
  padding-bottom: 6px !important;
}

.ExPadBLg {
  padding-bottom: 8px !important;
}

.ExPadBXl {
  padding-bottom: 10px !important;
}

.ExPadBXXl {
  padding-bottom: 12px !important;
}

.ExPadLNone {
  padding-left: 0 !important;
}

.ExPadLXs {
  padding-left: 2px !important;
}

.ExPadLSm {
  padding-left: 4px !important;
}

.ExPadLMd {
  padding-left: 6px !important;
}

.ExPadLLg {
  padding-left: 8px !important;
}

.ExPadLXl {
  padding-left: 10px !important;
}

.ExPadLXXl {
  padding-left: 12px !important;
}

.ExPadRNone {
  padding-right: 0 !important;
}

.ExPadRXs {
  padding-right: 2px !important;
}

.ExPadRSm {
  padding-right: 4px !important;
}

.ExPadRMd {
  padding-right: 6px !important;
}

.ExPadRLg {
  padding-right: 8px !important;
}

.ExPadRXl {
  padding-right: 10px !important;
}

.ExPadRXXl {
  padding-right: 12px !important;
}

.ExBdrWdtNone {
  border-width: 0 !important;
}

.ExBdrWdtLgh {
  border-width: 0.5px !important;
}

.ExBdrWdtNml {
  border-width: 1px !important;
}

.ExBdrWdtMdm {
  border-width: 2px !important;
}

.ExBdrWdtSbd {
  border-width: 3px !important;
}

.ExBdrWdtBld {
  border-width: 4px !important;
}

.ExBdrRadNone {
  border-radius: 0 !important;
}

.ExBdrRadXs {
  border-radius: 2px !important;
}

.ExBdrRadSm {
  border-radius: 4px !important;
}

.ExBdrRadMd {
  border-radius: 6px !important;
}

.ExBdrRadLg {
  border-radius: 8px !important;
}

.ExBdrRadXl {
  border-radius: 10px !important;
}

.ExBdrRadXXl {
  border-radius: 12px !important;
}

.ExAbs {
  position: absolute;
  margin: 0 !important;
  width: auto;
}

.ExTNone {
  top: 0;
}

.ExTXs {
  top: 2px;
}

.ExTSm {
  top: 4px;
}

.ExTMd {
  top: 6px;
}

.ExTLg {
  top: 8px;
}

.ExTXl {
  top: 10px;
}

.ExTXXl {
  top: 12px;
}

.ExBNone {
  bottom: 0;
}

.ExBXs {
  bottom: 2px;
}

.ExBSm {
  bottom: 4px;
}

.ExBMd {
  bottom: 6px;
}

.ExBLg {
  bottom: 8px;
}

.ExBXl {
  bottom: 10px;
}

.ExBXXl {
  bottom: 12px;
}

.ExLNone {
  left: 0;
}

.ExLXs {
  left: 2px;
}

.ExLSm {
  left: 4px;
}

.ExLMd {
  left: 6px;
}

.ExLLg {
  left: 8px;
}

.ExLXl {
  left: 10px;
}

.ExLXXl {
  left: 12px;
}

.ExRNone {
  right: 0;
}

.ExRXs {
  right: 2px;
}

.ExRSm {
  right: 4px;
}

.ExRMd {
  right: 6px;
}

.ExRLg {
  right: 8px;
}

.ExRXl {
  right: 10px;
}

.ExRXXl {
  right: 12px;
}

.ExWR {
  font-weight: normal !important;
}

.ExWR * {
  font-weight: inherit;
}

.ExWB {
  font-weight: bold !important;
}

.ExWB * {
  font-weight: inherit;
}

.ExFntStyNml {
  font-style: normal !important;
}

.ExFntStyNml * {
  font-style: inherit;
}

.ExFntStyIt {
  font-style: italic !important;
}

.ExFntStyIt * {
  font-style: inherit;
}

.ExTxtDecNone {
  text-decoration: none !important;
}

.ExTxtDecUl {
  text-decoration: underline !important;
}

.ExTxtDecLt {
  text-decoration: line-through !important;
}`;function Ht(e,t){let i=Gt(),a="";return t.type==="flex"&&((t=t.contents).type==="bubble"?(a=St(t),i=i.replace("<!-- inner -->",a)):t.type==="carousel"&&t.contents.forEach(((o,d)=>{let s=St(o);s=s.replace("<!-- content -->",""),s=s.replace("<!-- inner -->",""),i=i.replace("<!-- inner -->",s+"<!-- inner -->")}))),document.getElementById(e).innerHTML+=i,i}function St(e){let{hero:t,header:i,body:a,footer:o}=e,d=Qt(e),s=Zt(e),c=te(e),b=ee(e),l=Jt(e),x="";if(t?.type==="video")x=jt(t);else if(t?.type==="image")x=xt("",t);else for(let p in t)t.hasOwnProperty(p)&&p==="type"&&t[p]==="box"&&(x=H(t),layout=t.layout,x=C(x,layout,t.contents));d=d.replace("<!-- inner -->",x),x="";for(let p in i)i.hasOwnProperty(p)&&p==="type"&&i[p]==="box"&&(x=H(i),layout=i.layout,x=C(x,layout,i.contents));s=s.replace("<!-- inner -->",x),x="";for(let p in a)a.hasOwnProperty(p)&&p==="type"&&a[p]==="box"&&(x=H(a),layout=a.layout,x=C(x,layout,a.contents));c=c.replace("<!-- inner -->",x),x="";for(let p in o)o.hasOwnProperty(p)&&p==="type"&&o[p]==="box"&&(x=H(o),layout=o.layout,x=C(x,layout,o.contents));return b=b.replace("<!-- inner -->",x),l=l.replace("<!-- hero -->",d),l=l.replace("<!-- header -->",s),l=l.replace("<!-- body -->",c),l=l.replace("<!-- footer -->",b),l}function jt(e){return`<div class="ExCover MdImg ExFull"><div><video width="100%" poster="${e?.previewUrl}" controls>
   <source src="${e?.url}" type="video/mp4">
   <source src="${e?.url}" type="video/ogg">
   <source src="${e?.url}" type="video/webm">
</video></div></div>`}function C(e,t,i){let a=[];return i.forEach(((o,d)=>{let s;if(o.type==="box"){let c=H(o);layout2=o.layout,s=C(c,layout2,o.contents)}else if(o.type==="text"&&o.contents&&o.contents.length>0){let c=xt(t,o);layout2=o.layout,s=C(c,layout2,o.contents)}else s=xt(t,o);a[d]=s})),i.forEach(((o,d)=>{a[d]=a[d].replace("<!-- content -->",""),e=e.replace("<!-- content -->",a[d]+"<!-- content -->")})),e}function xt(e,t){switch(t.type){case"image":object=Dt(t);break;case"icon":object=Vt(t);break;case"text":object=ie(t);break;case"span":object=Kt(t);break;case"button":object=Ft(t);break;case"filler":object=qt(t);break;case"spacer":object=Yt(t);break;case"separator":object=Ut(e,t);break;default:object=null}return object}function H(e){let t="",{layout:i,position:a,flex:o,spacing:d,margin:s,width:c,height:b,backgroundColor:l,borderColor:x,borderWidth:p,cornerRadius:f,justifyContent:u,alignItems:y,offsetTop:h,offsetBottom:v,offsetStart:w,offsetEnd:E,paddingAll:B,paddingTop:T,paddingBottom:z,paddingStart:X,paddingEnd:O,background:M,maxWidth:J,maxHeight:Q}=e;if(i==="baseline"?(layout1="hr",layout2="bl"):i==="horizontal"?(layout1="hr",layout2=""):i==="vertical"&&(layout1="vr",layout2=""),fl="",o>3?t+=`-webkit-box-flex:${o};flex-grow:${o};`:fl=o>=0?`fl${o}`:"",exabs=a==="absolute"?"ExAbs":"",d&&d.indexOf("px")>=0?(spc="",t+=`gap:${d};`):spc=d?"spc"+m(d):"",s&&s.indexOf("px")>=0?(t+=`margin-top:${s};`,exmgn=""):exmgn=s?"ExMgnT"+m(s):"",c&&c!==""&&(t+=`width:${c}; max-width:${c};`),b&&b!==""&&(t+=`height:${b};`),l&&(t+=`background-color:${l} !important;`),x&&(t+=`border-color:${x} !important;`),p&&p.indexOf("px")>=0)t+=`border-width:${p};`,ExBdr="";else switch(p){case"none":ExBdr="ExBdrWdtNone";break;case"light":ExBdr="ExBdrWdtLgh";break;case"normal":ExBdr="ExBdrWdtNml";break;case"medium":ExBdr="ExBdrWdtMdm";break;case"semi-bold":ExBdr="ExBdrWdtSbd";break;case"bold":ExBdr="ExBdrWdtBld";break;default:ExBdr=""}if(f&&f.indexOf("px")>=0?(t+=`border-radius:${f};`,ExBdrRad=""):ExBdrRad=f?"ExBdrRad"+m(f):"",jfc="",u&&u!=="")switch(u){case"center":jfc="itms-jfcC";break;case"flex-start":jfc="itms-jfcS";break;case"flex-end":jfc="itms-jfcE";break;case"space-between":jfc="itms-jfcSB";break;case"space-around":jfc="itms-jfcSA";break;case"space-evenly":jfc="itms-jfcSE";break;default:jfc=""}if(alg="",y&&y!=="")switch(y){case"center":alg="itms-algC";break;case"flex-start":alg="itms-algS";break;case"flex-end":alg="itms-algE";break;default:alg=""}return h&&h.indexOf("px")>=0?(t+=`top:${h};`,ext=""):ext=h?"ExT"+m(h):"",v&&v.indexOf("px")>=0?(t+=`bottom:${v};`,exb=""):exb=v?"ExB"+m(v):"",w&&w.indexOf("px")>=0?(t+=`left:${w};`,exl=""):exl=w?"ExL"+m(w):"",E&&E.indexOf("px")>=0?(t+=`right:${E};`,exr=""):exr=E?"ExR"+m(E):"",B&&B.indexOf("px")>=0?(t+=`padding:${B};`,ExPadA=""):ExPadA=B?"ExPadA"+m(B):"",T&&T.indexOf("px")>=0?(t+=`padding-top:${T};`,ExPadT=""):ExPadT=T?"ExPadT"+m(T):"",z&&z.indexOf("px")>=0?(t+=`padding-bottom:${z};`,ExPadB=""):ExPadB=z?"ExPadB"+m(z):"",X&&X.indexOf("px")>=0?(t+=`padding-left:${X};`,ExPadL=""):ExPadL=X?"ExPadL"+m(X):"",O&&O.indexOf("px")>=0?(t+=`padding-right:${O};`,ExPadR=""):ExPadR=O?"ExPadR"+m(O):"",M&&M.type==="linearGradient"&&(centerPosition=M.centerPosition?M.centerPosition:"50%",M.centerColor?t+=`background: linear-gradient(${M.angle}, ${M.startColor} 0%, ${M.centerColor} ${centerPosition}, ${M.endColor} 100%);`:t+=`background: linear-gradient(${M.angle}, ${M.startColor} 0%, ${M.endColor} 100%);`),J&&J.indexOf("px")>=0&&(t+=`max-width:${J};`),Q&&Q.indexOf("px")>=0&&(t+=`max-height:${Q};`),`<div class="MdBx ${layout1} ${layout2} ${fl} ${exabs} ${exmgn} ${spc} ${ExBdr} ${ExBdrRad} ${jfc} ${alg} ${ext} ${exb} ${exl} ${exr} ${ExPadA} ${ExPadT} ${ExPadB} ${ExPadL} ${ExPadR}" style="${t}"><!-- content --></div>`}function Ft(e){style2="",style3="";let{flex:t,margin:i,position:a,height:o,style:d,color:s,gravity:c,adjustMode:b,offsetTop:l,offsetBottom:x,offsetStart:p,offsetEnd:f,action:u}=e;if(fl="",t>3?style2+=`-webkit-box-flex:${t};flex-grow:${t};`:fl=t>=0?`fl${t}`:"",exabs=a==="absolute"?"ExAbs":"",i&&i.indexOf("px")>=0?(style2+=`margin-top:${i};`,exmgn=""):exmgn=i?"ExMgnT"+m(i):"",o=o&&o!==""&&o!=="md"?"Ex"+m(o):"",grv=c==="bottom"||c==="center"?"grv"+j(c):"",ExBtn="ExBtnL",d&&d!=="")switch(d){case"link":default:ExBtn="ExBtnL";break;case"primary":ExBtn="ExBtn1";break;case"secondary":ExBtn="ExBtn2"}return s&&(style3+=d==="link"?`color:${s} !important;`:`background-color:${s} !important;`),l&&l.indexOf("px")>=0?(style2+=`top:${l};`,ext=""):ext=l?"ExT"+m(l):"",x&&x.indexOf("px")>=0?(style2+=`bottom:${x};`,exb=""):exb=x?"ExB"+m(x):"",p&&p.indexOf("px")>=0?(style2+=`left:${p};`,exl=""):exl=p?"ExL"+m(p):"",f&&f.indexOf("px")>=0?(style2+=`right:${f};`,exr=""):exr=f?"ExR"+m(f):"",u=u||{type:"none"},u.type==="uri"?`<div class="MdBtn ${ExBtn} ${o} ${fl} ${exabs} ${exmgn} ${grv} ${ext} ${exb} ${exl} ${exr}" style="${style2}" id="8d1efea2-4017-4c89-8931-98a5f4f141f2"><a href="${u.uri}" target="_blank" style="${style3}"><div>${u.label}</div></a></div>`:u.type==="message"?`<div class="MdBtn ${ExBtn} ${o} ${fl} ${exabs} ${exmgn} ${grv} ${ext} ${exb} ${exl} ${exr}" style="${style2}" id="8d1efea2-4017-4c89-8931-98a5f4f141f2"><a onclick="alert('message: ${u.text}')" style="${style3}"><div>${u.label}</div></a></div>`:u.type==="postback"?`<div class="MdBtn ${ExBtn} ${o} ${fl} ${exabs} ${exmgn} ${grv} ${ext} ${exb} ${exl} ${exr}" style="${style2}" id="8d1efea2-4017-4c89-8931-98a5f4f141f2"><a onclick="alert('postback data: ${u.data}')" style="${style3}"><div>${u.label}</div></a></div>`:`<div class="MdBtn ${ExBtn} ${o} ${fl} ${exabs} ${exmgn} ${grv} ${ext} ${exb} ${exl} ${exr}" style="${style2}" id="8d1efea2-4017-4c89-8931-98a5f4f141f2"><a style="${style3}"><div>${u.label}</div></a></div>`}function qt(e){let t="",{flex:i}=e;return fl="",i>3?t+=`-webkit-box-flex:${i};flex-grow:${i};`:fl=i>=0?`fl${i}`:"",`<div class="mdBxFiller ${fl}" style="${t}" ></div>`}function Vt(e){let t="",{size:i,aspectRatio:a,url:o,position:d,margin:s,offsetTop:c,offsetBottom:b,offsetStart:l,offsetEnd:x}=e,p=`background-image:url('${o}');`;return i=i&&i!==""?i:"md",i.indexOf("px")>=0?(t+=`font-size:${i};`,i=""):i="Ex"+m(i),a&&a!==""?(ratio=ratio[0]/ratio[1],p+=`width:${ratio}em;`):p+="width:1em;",exabs=d==="absolute"?"ExAbs":"",s&&s.indexOf("px")>=0?(t+=`margin-top:${s};`,exmgn=""):exmgn=s?"ExMgnT"+m(s):"",c&&c.indexOf("px")>=0?(t+=`top:${c};`,ext=""):ext=c?"ExT"+m(c):"",b&&b.indexOf("px")>=0?(t+=`bottom:${b};`,exb=""):exb=b?"ExB"+m(b):"",l&&l.indexOf("px")>=0?(t+=`left:${l};`,exl=""):exl=l?"ExL"+m(l):"",x&&x.indexOf("px")>=0?(t+=`right:${x};`,exr=""):exr=x?"ExR"+m(x):"",`<div class="MdIco fl0 ${i} ${exabs} ${exmgn} ${ext} ${exb} ${exl} ${exr}" style="${t}" ><div><span style="${p}"></span></div></div>`}function Dt(e){let t="",i="",{aspectMode:a,size:o,aspectRatio:d,url:s,position:c,flex:b,margin:l,align:x,gravity:p,backgroundColor:f,offsetTop:u,offsetBottom:y,offsetStart:h,offsetEnd:v,action:w}=e,E=`background-image:url('${s}');`;return f&&(E+=`background-color:${f} !important;`),a=a&&a!==""?a:"fit",o=o&&o!==""?o:"md",a=m(a),o.indexOf("px")>=0||o.indexOf("%")>=0?(i+=`width:${o};`,o=""):o="Ex"+m(o),d&&d!==""?(ratio=d.split(":"),ratio=100*ratio[1]/ratio[0]):ratio="100",fl="",b>3?t+=`-webkit-box-flex:${b};flex-grow:${b};`:fl=b>=0?`fl${b}`:"",exabs=c==="absolute"?"ExAbs":"",l&&l.indexOf("px")>=0?(t+=`margin-top:${l};`,exmgn=""):exmgn=l?"ExMgnT"+m(l):"",alg=x==="start"||x==="end"?"alg"+j(x):"",grv=p==="bottom"||p==="center"?"grv"+j(p):"",u&&u.indexOf("px")>=0?(t+=`top:${u};`,ext=""):ext=u?"ExT"+m(u):"",y&&y.indexOf("px")>=0?(t+=`bottom:${y};`,exb=""):exb=y?"ExB"+m(y):"",h&&h.indexOf("px")>=0?(t+=`left:${h};`,exl=""):exl=h?"ExL"+m(h):"",v&&v.indexOf("px")>=0?(t+=`right:${v};`,exr=""):exr=v?"ExR"+m(v):"",w=w||{type:"none"},w.type==="uri"?`<div class="MdImg Ex${a} ${fl} ${o} ${exabs} ${exmgn} ${alg} ${grv} ${ext} ${exb} ${exl} ${exr}"  style="${t}">
                  <div style="${i}">
                     <a href="${w.uri}" target="_blank" style="padding-bottom:${ratio}%;">
                        <span style="${E}"></span>
                     </a>
                  </div>
               </div>`:w.type==="message"?`<div class="MdImg Ex${a} ${fl} ${o} ${exabs} ${exmgn} ${alg} ${grv} ${ext} ${exb} ${exl} ${exr}"  style="${t}">
                  <div style="${i}">
                     <a onclick="alert('message: ${w.text}')" style="padding-bottom:${ratio}%;">
                        <span style="${E}"></span>
                     </a>
                  </div>
               </div>`:w.type==="postback"?`<div class="MdImg Ex${a} ${fl} ${o} ${exabs} ${exmgn} ${alg} ${grv} ${ext} ${exb} ${exl} ${exr}"  style="${t}">
                  <div style="${i}">
                     <a onclick="alert('postback data: ${w.data}')" style="padding-bottom:${ratio}%;">
                        <span style="${E}"></span>
                     </a>
                  </div>
               </div>`:`<div class="MdImg Ex${a} ${fl} ${o} ${exabs} ${exmgn} ${alg} ${grv} ${ext} ${exb} ${exl} ${exr}"  style="${t}">
                  <div style="${i}">
                     <a style="padding-bottom:${ratio}%;">
                        <span style="${E}"></span>
                     </a>
                  </div>
               </div>`}function Ut(e,t){let i="",{margin:a,color:o}=t;return a&&a.indexOf("px")>=0?(i+=e==="vertical"?`margin-top:${a};`:`margin-left:${a};`,exmgn=""):exmgn=a?"ExMgnT"+m(a):"",o&&(i+=`border-color:${o} !important;`),`<div class="fl0 MdSep ${exmgn}" style="${i}" ></div>`}function Yt(e){let{size:t}=e;return t=t&&t!==""?t:"md",t=t.indexOf("px")>=0?"":"spc"+m(t),`<div class="mdBxSpacer ${t} fl0" ></div>`}function Kt(e){let t="",{text:i,size:a,color:o,weight:d,style:s,decoration:c}=e;return a&&a!==""?a.indexOf("px")>=0?(t+=`font-size:${a};`,a=""):a="Ex"+m(a):a="",o&&o!==""&&(t+=`color:${o};`),ExWB=d==="bold"?"ExWB":"",ExFntSty=s==="normal"?"ExFntStyNml":s==="italic"?"ExFntStyIt":"",ExTxtDec=c==="line-through"?"ExTxtDecLt":c==="underline"?"ExTxtDecUl":c==="none"?"ExTxtDecNone":"",`<span class="MdSpn ${ExWB} ${a} ${ExFntSty} ${ExTxtDec}" style="${t}" >${i}</span>`}function Gt(){return'<div class="LySlider"><div class="lyInner"><!-- inner --></div></div><br>'}function Jt(e){let{size:t,direction:i,action:a}=e;return t=t&&t!==""?t:"medium",i=i&&i!=""?i:"ltr",t=ae(t),`<div class="lyItem Ly${t}"><div class="T1 fx${i.toUpperCase()}" dir="${i}"><!-- header --><!-- hero --><!-- body --><!-- footer --></div></div>`}function Qt(e){let{styles:t}=e,i="";if(t){let{hero:a}=t;i=a&&a.backgroundColor?`background-color:${a.backgroundColor}`:""}return`<div class="t1Hero" style="${i}"><!-- inner --></div>`}function Zt(e){let{styles:t}=e,i="";if(t){let{header:a}=t;i=a&&a.backgroundColor?`background-color:${a.backgroundColor}`:""}return`<div class="t1Header" style="${i}"><!-- inner --></div>`}function te(e){let{footer:t,styles:i}=e,a="";if(i){let{body:o}=i;a=o&&o.backgroundColor?`background-color:${o.backgroundColor}`:""}return`<div class="t1Body ${t?"ExHasFooter":""}" style="${a}"><!-- inner --></div>`}function ee(e){let{styles:t}=e,i="";if(t){let{footer:a}=t;i=a&&a.backgroundColor?`background-color:${a.backgroundColor}`:""}return`<div class="t1Footer" style="${i}"><!-- inner --></div>`}function ie(e){let t="",{flex:i,margin:a,size:o,position:d,align:s,gravity:c,text:b,color:l,weight:x,style:p,decoration:f,wrap:u,maxLines:y,adjustMode:h,offsetTop:v,offsetBottom:w,offsetStart:E,offsetEnd:B,lineSpacing:T}=e;return fl="",i>3?t+=`-webkit-box-flex:${i};flex-grow:${i};`:fl=i>=0?`fl${i}`:"",exabs=d==="absolute"?"ExAbs":"",a&&a.indexOf("px")>=0?(t+=`margin-top:${a};`,exmgn=""):exmgn=a?"ExMgnL"+m(a):"",alg=s==="start"||s==="end"||s==="center"?"ExAlg"+j(s):"",grv=c==="bottom"||c==="center"?"grv"+j(c):"",o=o&&o!==""?o:"md",o.indexOf("px")>=0?(t+=`font-size:${o};`,o=""):o="Ex"+m(o),l&&l!==""&&(t+=`color:${l};`),ExWB=x==="bold"?"ExWB":"",ExFntSty=p==="normal"?"ExFntStyNml":p==="italic"?"ExFntStyIt":"",ExTxtDec=f==="line-through"?"ExTxtDecLt":f==="underline"?"ExTxtDecUl":f==="none"?"ExTxtDecNone":"",ExWrap=u===!0?"ExWrap":"",v&&v.indexOf("px")>=0?(t+=`top:${v};`,ext=""):ext=v?"ExT"+m(v):"",w&&w.indexOf("px")>=0?(t+=`bottom:${w};`,exb=""):exb=w?"ExB"+m(w):"",E&&E.indexOf("px")>=0?(t+=`left:${E};`,exl=""):exl=E?"ExL"+m(E):"",B&&B.indexOf("px")>=0?(t+=`right:${B};`,exr=""):exr=B?"ExR"+m(B):"",T&&T.indexOf("px")>=0&&(t+=`line-height:${parseInt(T.replace("px",""))+15+"px"};`),b=b||"",`<div class="MdTxt ${fl} ${exabs} ${exmgn} ${alg} ${grv} ${o} ${ExWB} ${ExFntSty} ${ExTxtDec} ${ExWrap} ${ext} ${exb} ${exl} ${exr}" style="${t}"><p>${b}<!-- content --></p></div>`}function j(e){return e.charAt(0).toUpperCase()}function ae(e){return e.charAt(0).toUpperCase()+e.substring(1,2)}function m(e){return e.charAt(0).toUpperCase()+e.slice(1)}window.flex2html=Ht;function G(){var e=1;function t(){e--,e<=0&&oe()}if(window.Ably)t();else{var i=document.createElement("script");i.src="https://cdn.ably.com/lib/ably.min-1.js",i.onload=t,i.onerror=function(){n.inputEl.placeholder="Failed to load messaging library."},document.head.appendChild(i)}if(!window.flex2html&&!document.getElementById("bcw-flex2html-css")){var a=document.createElement("style");a.id="bcw-flex2html-css",a.textContent=Tt,document.head.appendChild(a)}if(g.AVATAR_ENABLED&&!window.WebAvatar){e++;var o=document.createElement("script");o.src=g.AVATAR_WIDGET_SRC,o.onload=t,o.onerror=function(){console.warn("[BotnoiChatWidget] Failed to load avatar widget."),t()},document.head.appendChild(o)}}async function oe(){if(r.initialized)try{let t=await ft(r.WORKER_URL,r.BOT_ID);if(!r.initialized)return;if(!t.success){n.inputEl.placeholder="Bot connection failed.",S("offline","Offline"),gt("Error: The requested Bot ID does not exist or cannot be authorized.");return}if(t.bot_name&&(n.headerTitle.textContent=t.bot_name),t.bot_avatar&&(n.headerAvatar.src=t.bot_avatar,n.headerAvatar.classList.add("bcw-show")),window._bcwAblyInstances=window._bcwAblyInstances||[],r.ably=new window.Ably.Realtime({authUrl:`${r.WORKER_URL}/api/auth`}),window._bcwAblyInstances.push(r.ably),r.ably.connection.on(function(i){switch(i.current){case"connected":S("online","Online");break;case"disconnected":case"suspended":S("offline","Disconnected");break;case"closed":case"failed":S("offline","Offline");break;case"connecting":S("","Connecting\u2026");break}}),Et(),kt(),g.AVATAR_ENABLED&&window.WebAvatar){var e=window.innerWidth<=440;window.WebAvatar.init({modelUrl:r.AVATAR_MODEL,defaultAnimationUrl:"Idleloop",cameraTarget:{x:0,y:0,z:-2},offset:{x:e?50:360,y:90}}),re()}n.inputEl.disabled=!1,n.sendBtn.disabled=!1,n.inputEl.placeholder="Type a message\u2026",g.AUTO_FOCUS_INPUT&&n.inputEl.focus()}catch(t){n.inputEl.placeholder="Network error occurred.",S("offline","Offline"),console.error("[BotnoiChatWidget]",t)}}function re(){var e=!1;function t(){e||(e=!0,r.avatarReady=!0,r.isOpen&&q())}function i(){window.removeEventListener("avatar-widget-ready",i),t()}r.avatarListener=i,window.addEventListener("avatar-widget-ready",i);var a=0;r.avatarPoll=setInterval(function(){a++;var o=document.getElementById("avatar-widget-container");if(o){var d=o.querySelector("canvas");d&&d.width>0&&(setTimeout(function(){r.avatarPoll&&clearInterval(r.avatarPoll),t()},500),r.avatarPoll&&clearInterval(r.avatarPoll))}a>=150&&(r.avatarPoll&&clearInterval(r.avatarPoll),t())},200)}function ne(){"use strict";var e=document.createElement("style");e.textContent=pt,document.head.appendChild(e);var t=document.createElement("div");t.id="botnoi-chat-widget",t.innerHTML=bt(),document.body.appendChild(t),n.fab=t.querySelector("#bcw-fab"),n.panel=t.querySelector("#bcw-panel"),n.inputEl=t.querySelector("#bcw-input"),n.sendBtn=t.querySelector("#bcw-send-btn"),n.collapseBtn=t.querySelector("#bcw-collapse-btn"),n.messagesEl=t.querySelector("#bcw-messages"),n.messagesOuterEl=t.querySelector("#bcw-messages-outer"),n.clearBtn=t.querySelector("#bcw-clear-btn"),n.headerAvatar=t.querySelector("#bcw-header-avatar"),n.headerTitle=t.querySelector("#bcw-header-title"),n.statusDot=t.querySelector(".bcw-status-dot"),n.statusText=t.querySelector("#bcw-status-text"),n.volumeBtn=t.querySelector("#bcw-volume-btn"),n.volumeSlider=t.querySelector("#bcw-volume-slider"),n.volIcon=t.querySelector("#bcw-vol-icon"),n.muteIcon=t.querySelector("#bcw-mute-icon");function i(){ct(),r.avatarPoll&&(clearInterval(r.avatarPoll),r.avatarPoll=null),r.avatarListener&&(window.removeEventListener("avatar-widget-ready",r.avatarListener),r.avatarListener=null),t&&t.parentNode&&t.parentNode.removeChild(t),r.initialized=!1,r.isOpen=!1,r.needsSetup=!1}window._bcwDisconnects=window._bcwDisconnects||[],window._bcwDisconnects.push(i),window.botnoiApp={loadAblyAndInit:G,disconnect:i};var a=null;n.messagesEl.addEventListener("scroll",function(){n.messagesEl.classList.add("bcw-scrolling"),clearTimeout(a),a=setTimeout(function(){n.messagesEl.classList.remove("bcw-scrolling")},900)},{passive:!0}),n.messagesEl.addEventListener("mousemove",function(l){for(var x=n.messagesEl.querySelectorAll(".bcw-bot-msg"),p=0;p<x.length;p++){var f=x[p].getBoundingClientRect();l.clientY>=f.top&&l.clientY<=f.bottom?x[p].classList.add("bcw-row-hover"):x[p].classList.remove("bcw-row-hover")}},{passive:!0}),n.messagesEl.addEventListener("mouseleave",function(){n.messagesEl.querySelectorAll(".bcw-bot-msg.bcw-row-hover").forEach(function(l){l.classList.remove("bcw-row-hover")})},{passive:!0}),(function(){var l=0,x=0,p=!1;n.messagesEl.addEventListener("touchstart",function(u){l=u.touches[0].clientY,x=n.messagesEl.scrollTop,p=!1,n.messagesEl.style.transition="",n.messagesEl.style.transform=""},{passive:!0}),n.messagesEl.addEventListener("touchmove",function(u){var y=u.touches[0].clientY-l,h=x<=0&&y>0,v=x>=n.messagesEl.scrollHeight-n.messagesEl.clientHeight-1&&y<0;if(h||v){p=!0;var w=y/3;n.messagesEl.style.transform="translateY("+w+"px)"}},{passive:!0});function f(){p&&(p=!1,n.messagesEl.style.transition="transform 0.5s cubic-bezier(.25,.46,.45,.94)",n.messagesEl.style.transform="translateY(0)",n.messagesEl.addEventListener("transitionend",function u(){n.messagesEl.style.transition="",n.messagesEl.removeEventListener("transitionend",u)}))}n.messagesEl.addEventListener("touchend",f,{passive:!0}),n.messagesEl.addEventListener("touchcancel",f,{passive:!0})})();let o=100,d=!1;function s(l){l===0?(n.volIcon.style.display="none",n.muteIcon.style.display=""):(n.volIcon.style.display="",n.muteIcon.style.display="none")}n.volumeSlider.addEventListener("input",function(){var l=parseInt(n.volumeSlider.value,10);d=l===0,l>0&&(o=l),s(l),window.WebAvatar&&window.WebAvatar.setVolume(l/100)}),n.volumeBtn.addEventListener("click",function(){d?(d=!1,n.volumeSlider.value=o,s(o),window.WebAvatar&&window.WebAvatar.setVolume(o/100)):(d=!0,o=parseInt(n.volumeSlider.value,10)||100,n.volumeSlider.value=0,s(0),window.WebAvatar&&window.WebAvatar.setVolume(0))});function c(){r.isOpen=!0,n.panel.classList.add("bcw-visible"),n.fab.classList.add("bcw-hidden"),q(),!r.initialized&&!r.needsSetup?(r.initialized=!0,G()):r.needsSetup?Y(G):g.AUTO_FOCUS_INPUT&&n.inputEl.focus()}function b(){r.isOpen=!1,n.panel.classList.remove("bcw-visible"),n.fab.classList.remove("bcw-hidden"),V()}n.fab.addEventListener("click",c),n.collapseBtn.addEventListener("click",b),t.querySelector("#bcw-header").addEventListener("click",function(l){l.target.closest("#bcw-clear-btn, #bcw-volume-group")||b()}),n.clearBtn.addEventListener("click",Bt),n.sendBtn.addEventListener("click",()=>I()),n.inputEl.addEventListener("keypress",function(l){l.key==="Enter"&&I()})}ne();})();
