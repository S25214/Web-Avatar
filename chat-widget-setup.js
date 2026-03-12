(function() {
    const STYLES = `
        /* Overlay - Gradually dims the background */
        .wa-setup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            z-index: 10000;
            font-family: 'Prompt', sans-serif;
            box-sizing: border-box;
        }

        .wa-setup-overlay * {
            box-sizing: border-box;
        }

        .wa-setup-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        /* Popup Container - Zoom animation */
        .wa-setup-popup {
            background-color: #ffffff;
            width: 800px;
            max-width: 90%;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            padding: 24px;
            display: flex;
            flex-direction: column;
            transform: scale(0.85);
            opacity: 0;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
        }

        .wa-setup-overlay.active .wa-setup-popup {
            transform: scale(1);
            opacity: 1;
        }

        .wa-setup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .wa-setup-title {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin: 0;
            font-family: 'Prompt', sans-serif;
        }

        .wa-setup-close-btn {
            background: none;
            border: none;
            font-size: 28px;
            color: #888;
            cursor: pointer;
            line-height: 1;
            padding: 0;
            transition: color 0.2s;
        }

        .wa-setup-close-btn:hover {
            color: #333;
        }

        /* Form Section */
        .wa-setup-section-title {
            font-size: 14px;
            font-weight: 600;
            color: #555;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .wa-setup-input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 8px;
        }

        .wa-setup-error-text {
            color: #ef4444;
            font-size: 13px;
            margin-bottom: 24px;
            min-height: 18px;
            display: none;
        }

        .wa-setup-input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 15px;
            font-family: 'Courier New', Courier, monospace;
            color: #333;
            background: white;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .wa-setup-input:focus {
            border-color: #00aeef;
            box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.1);
        }

        .wa-setup-save-btn {
            background-color: #00aeef;
            color: white;
            border: none;
            padding: 0 24px;
            border-radius: 8px;
            font-family: inherit;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .wa-setup-save-btn:hover {
            background-color: #0098d6;
        }
        
        .wa-setup-save-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        /* Code Block Area */
        .wa-setup-code-container {
            position: relative;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            font-family: 'Prompt', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            margin-bottom: 24px;
        }

        #waScriptDisplay {
            white-space: pre;
            overflow-x: auto;
        }

        .wa-setup-copy-icon {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            color: #a0a0a0;
            background: none;
            border: none;
            width: 32px;
            height: 32px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background-color 0.2s, color 0.2s;
        }
        
        .wa-setup-copy-icon:hover {
            color: #555;
            background-color: #f0f0f0;
        }

        .wa-setup-copy-icon svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
            display: block;
        }

        /* Syntax Highlighting */
        .wa-c-tag { color: #008080; }
        .wa-c-attr { color: #0000ff; }
        .wa-c-str { color: #a31515; }

        /* Footer */
        .wa-setup-footer {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }

        .wa-setup-done-btn {
            background-color: #00aeef;
            color: white;
            border: none;
            padding: 12px 36px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 500;
            font-family: 'Prompt', sans-serif;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .wa-setup-done-btn:hover {
            background-color: #0098d6;
        }

        /* Speaker Selection Styles */
        .wa-setup-toggle-container {
            display: flex;
            background-color: #e5e7eb;
            border-radius: 8px;
            padding: 4px;
            margin-bottom: 16px;
        }

        .wa-setup-toggle-btn {
            flex: 1;
            padding: 8px;
            background: transparent;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-family: inherit;
            color: #6b7280;
            cursor: pointer;
            transition: all 0.2s;
        }

        .wa-setup-toggle-btn.active {
            background: white;
            color: #00aeef;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            font-weight: 500;
        }

        .wa-setup-dropdown-container {
            position: relative;
            margin-bottom: 32px;
        }

        .wa-setup-dropdown-selected {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: border-color 0.2s;
        }

        .wa-setup-dropdown-selected:hover {
            border-color: #9ca3af;
        }

        .wa-setup-dropdown-list {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            margin-top: 4px;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            max-height: 250px;
            overflow-y: auto;
            z-index: 10001;
            display: none;
        }

        .wa-setup-dropdown-list.show {
            display: block;
        }

        .wa-setup-search-container {
            padding: 8px;
            border-bottom: 1px solid #f3f4f6;
            background: #ffffff;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        .wa-setup-search-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 13px;
            font-family: inherit;
            outline: none;
            box-sizing: border-box;
            background-color: #f9fafb;
            color: #333;
            transition: border-color 0.2s, background-color 0.2s;
        }

        .wa-setup-search-input:focus {
            border-color: #00aeef;
            background-color: #ffffff;
        }

        .wa-setup-dropdown-item {
            display: flex;
            align-items: center;
            padding: 10px 16px;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
            transition: background-color 0.2s;
        }

        .wa-setup-dropdown-item:last-child {
            border-bottom: none;
        }

        .wa-setup-dropdown-item:hover {
            background-color: #f9fafb;
        }

        .wa-speaker-img {
            width: 39px;
            height: 39px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 12px;
            background-color: #e5e7eb;
        }

        .wa-speaker-info {
            flex: 1;
        }

        .wa-speaker-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
        }

        .wa-speaker-desc {
            font-size: 12px;
            color: #6b7280;
        }

        .wa-speaker-play {
            background: none;
            border: none;
            color: #00aeef;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
        }
        
        .wa-speaker-play:hover {
            background-color: #e0f2fe;
        }

        .wa-speaker-play svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }
    `;

    const WebAvatarSetup = {
        overlay: null,
        botId: null,
        speakersData: { v1: [], v2: [] },
        vrmModels: [],
        currentVersion: 'v1',
        selectedSpeaker: null,
        selectedCharacter: null,
        isBnvStored: false,
        audioElement: null,
        uiLang: 'en',
        
        i18n: {
            en: {
                title: "WebAvatar Chat",
                bnvKey: "Botnoi Voice Key",
                loading: "Loading...",
                save: "Save",
                saving: "Saving...",
                saved: "Saved!",
                voiceSpeaker: "Voice Speaker",
                version1: "Version 1",
                version2: "Version 2",
                loadingSpeakers: "Loading speakers...",
                errorLoadingSpeakers: "Error loading speakers.",
                noSpeakers: "No speakers available",
                scriptTitle: "Script",
                done: "DONE",
                speakerId: "Speaker ID:",
                invalidBnvKey: "Botnoi Voice Key is invalid.",
                saveFailedBnvKey: "Failed to save Botnoi Voice Key.",
                noAudioSample: "No audio sample available.",
                errorCheckBnvState: "Error checking BNV state",
                searchSpeakers: "Search speakers...",
                noResults: "No results found",
                searchSpeakers: "Search speakers...",
                noResults: "No results found",
                character: "Character",
                selectCharacter: "Select a character...",
                loadingCharacters: "Loading characters..."
            },
            th: {
                title: "เว็บอวาตาร์แชท",
                bnvKey: "Botnoi Voice Key",
                loading: "กำลังโหลด...",
                save: "บันทึก",
                saving: "กำลังบันทึก...",
                saved: "บันทึกแล้ว!",
                voiceSpeaker: "Voice Speaker",
                version1: "Version 1",
                version2: "Version 2",
                loadingSpeakers: "กำลังโหลดผู้พูด...",
                errorLoadingSpeakers: "เกิดข้อผิดพลาดในการโหลดผู้พูด",
                noSpeakers: "ไม่มีผู้พูด",
                scriptTitle: "Script",
                done: "เสร็จสิ้น",
                speakerId: "Speaker ID:",
                invalidBnvKey: "Botnoi Voice Key ไม่ถูกต้อง",
                saveFailedBnvKey: "ไม่สามารถบันทึก Botnoi Voice Key ได้",
                noAudioSample: "ไม่มีตัวอย่างเสียง",
                errorCheckBnvState: "เกิดข้อผิดพลาดในการตรวจสอบสถานะ BNV",
                searchSpeakers: "ค้นหาผู้พูด...",
                noResults: "ไม่พบข้อมูลผู้พูด",
                searchSpeakers: "ค้นหาผู้พูด...",
                noResults: "ไม่พบข้อมูลผู้พูด",
                character: "ตัวละคร",
                selectCharacter: "เลือกตัวละคร...",
                loadingCharacters: "กำลังโหลดตัวละคร..."
            }
        },
        
        t: function(key) {
            const lang = this.i18n[this.uiLang] ? this.uiLang : 'en';
            return this.i18n[lang][key] || key;
        },

        loadAvatarWidget: function() {
            return new Promise((resolve, reject) => {
                if (window.WebAvatar) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = './avatar-widget.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        },

        init: async function(bot_id, ui_lang = 'en') {
            this.botId = bot_id;
            this.uiLang = ui_lang;
            this.audioElement = new Audio();
            
            this.audioElement.addEventListener('play', () => this.updatePlayButtons());
            this.audioElement.addEventListener('pause', () => this.updatePlayButtons());
            this.audioElement.addEventListener('ended', () => this.updatePlayButtons());
            
            this.injectStyles();
            this.createPopup();
            this.fetchBnvState();
            this.fetchSpeakers();
            
            try {
                // Update character dropdown to show loading
                const charSelect = document.getElementById('waCharacterSelect');
                if(charSelect) charSelect.innerHTML = `<option>${this.t('loadingCharacters')}</option>`;
                
                await this.loadAvatarWidget();
                await window.WebAvatar.preload();
                this.vrmModels = await window.WebAvatar.getModels();
                this.renderCharacterDropdown();
            } catch (err) {
                console.error("Failed to load avatar widget or models", err);
            }
            
            // Show popup
            // Use a tiny timeout to allow DOM interaction so the transition triggers
            setTimeout(() => {
                this.overlay.classList.add('active');
            }, 10);
        },

        close: function() {
            // Clean up injected widget on close
            const widget = document.getElementById('botnoi-chat-widget');
            if (widget) widget.remove();
            
            const dynScript = document.getElementById('wa-dynamic-injected-script');
            if (dynScript) dynScript.remove();

            // Run all registered disconnect handlers to catch async script loads
            if (window._bcwDisconnects && window._bcwDisconnects.length > 0) {
                window._bcwDisconnects.forEach(disconnectFn => {
                    try { disconnectFn(); } catch (e) {}
                });
                window._bcwDisconnects = [];
            } else if (window.botnoiApp && typeof window.botnoiApp.disconnect === 'function') {
                // Fallback for older script versions
                window.botnoiApp.disconnect();
            }

            // if avatar widget native instance is there (due to earlier preview), disconnect
            if (window.WebAvatar) {
                try { window.WebAvatar.disconnect(); } catch (e) {}
            }

            if (this.audioElement) {
                this.audioElement.pause();
                this.audioElement.src = '';
            }
            if (this.overlay) {
                this.overlay.classList.remove('active');
                setTimeout(() => {
                    this.overlay.remove();
                    this.overlay = null;
                }, 300); // match transition duration
            }
        },

        updatePlayButtons: function() {
            const buttons = document.querySelectorAll('.wa-speaker-play');
            buttons.forEach(btn => {
                const audioSrc = btn.getAttribute('data-audio-src');
                const isCurrentAudio = audioSrc && this.audioElement.src && this.audioElement.src.includes(audioSrc);
                
                if (isCurrentAudio && !this.audioElement.paused) {
                    btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>`;
                } else {
                    btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
                }
            });
        },

        injectStyles: function() {
            if (!document.getElementById('wa-setup-styles')) {
                const style = document.createElement('style');
                style.id = 'wa-setup-styles';
                style.textContent = STYLES;
                
                // Add Google Fonts
                const fontLink = document.createElement('link');
                fontLink.href = "https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600&display=swap";
                fontLink.rel = "stylesheet";
                
                document.head.appendChild(fontLink);
                document.head.appendChild(style);
            }
        },

        createPopup: function() {
            if (this.overlay) {
                this.overlay.remove();
            }

            this.overlay = document.createElement('div');
            this.overlay.className = 'wa-setup-overlay';
            this.overlay.id = 'waSetupOverlay';

            this.overlay.innerHTML = `
                <div class="wa-setup-popup">
                    <div class="wa-setup-header">
                        <h2 class="wa-setup-title">${this.t('title')}</h2>
                        <button class="wa-setup-close-btn" id="waSetupCloseIcon" aria-label="Close setup">&times;</button>
                    </div>

                    <div class="wa-setup-section-title">${this.t('bnvKey')}</div>
                    <div class="wa-setup-input-group">
                        <input type="text" id="waBnvKeyInput" class="wa-setup-input" placeholder="${this.t('loading')}" disabled>
                        <button id="waBnvSaveBtn" class="wa-setup-save-btn" disabled>${this.t('save')}</button>
                    </div>
                    <div id="waBnvErrorText" class="wa-setup-error-text"></div>

                    <div class="wa-setup-section-title">${this.t('voiceSpeaker')}</div>
                    <div class="wa-setup-toggle-container">
                        <button class="wa-setup-toggle-btn active" id="waBtnV1">${this.t('version1')}</button>
                        <button class="wa-setup-toggle-btn" id="waBtnV2">${this.t('version2')}</button>
                    </div>
                    
                    <div class="wa-setup-dropdown-container" id="waDropdownContainer">
                        <div class="wa-setup-dropdown-selected" id="waDropdownSelected">
                            <span style="color: #6b7280; font-size: 14px;">${this.t('loadingSpeakers')}</span>
                            <span style="border-top: 5px solid #6b7280; border-left: 5px solid transparent; border-right: 5px solid transparent; margin-left: 8px;"></span>
                        </div>
                        <div class="wa-setup-dropdown-list" id="waDropdownList"></div>
                    </div>

                    <div class="wa-setup-section-title">${this.t('character')}</div>
                    <div class="wa-setup-input-group" style="margin-bottom: 24px;">
                        <select id="waCharacterSelect" class="wa-setup-input" style="cursor: pointer; padding: 10px 16px; font-family: 'Prompt', sans-serif;">
                            <option value="">${this.t('loadingCharacters')}</option>
                        </select>
                    </div>

                    <div class="wa-setup-section-title">${this.t('scriptTitle')}</div>
                    <div class="wa-setup-code-container">
                        <button class="wa-setup-copy-icon" id="waCopyBtn" aria-label="Copy code">
                            <svg viewBox="0 0 24 24">
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                            </svg>
                        </button>
                        <div id="waScriptDisplay"></div>
                    </div>

                    <div class="wa-setup-footer">
                        <button class="wa-setup-done-btn" id="waSetupDoneBtn">${this.t('done')}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(this.overlay);

            this.updateScriptDisplay();

            // Bind events
            document.getElementById('waSetupCloseIcon').addEventListener('click', () => this.close());
            document.getElementById('waSetupDoneBtn').addEventListener('click', () => this.close());
            
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.close();
            });

            document.getElementById('waCopyBtn').addEventListener('click', () => {
                const versionNum = this.currentVersion === 'v1' ? '1' : '2';
                const speakerId = this.selectedSpeaker ? this.selectedSpeaker.speaker_id : '13';
                const avatarName = this.selectedCharacter || 'Botnoi'; // Use selected character
                const rawScriptText = `<script src="https://webavatar.didthat.cc/chat-widget.js"\n    data-bot-id="${this.botId}"\n    data-bnv-version="${versionNum}"\n    data-bnv-speaker="${speakerId}"\n    data-avatar-url="${avatarName}">\n</script>`;
                
                navigator.clipboard.writeText(rawScriptText).then(() => {
                    const btn = document.getElementById('waCopyBtn');
                    const originalColor = btn.style.color;
                    btn.style.color = '#4CAF50';
                    setTimeout(() => {
                        btn.style.color = originalColor || '#a0a0a0';
                    }, 2000);
                }).catch(err => {
                    console.error("Failed to copy clipboard:", err);
                });
            });

            document.getElementById('waBnvSaveBtn').addEventListener('click', () => this.saveBnvKey());

            // Dropdown Events
            document.getElementById('waBtnV1').addEventListener('click', () => this.setVersion('v1'));
            document.getElementById('waBtnV2').addEventListener('click', () => this.setVersion('v2'));
            
            const dropSelected = document.getElementById('waDropdownSelected');
            dropSelected.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.speakersData[this.currentVersion].length > 0) {
                    const dropdownList = document.getElementById('waDropdownList');
                    dropdownList.classList.toggle('show');
                    if (dropdownList.classList.contains('show')) {
                        const searchInput = dropdownList.querySelector('.wa-setup-search-input');
                        if (searchInput) {
                            setTimeout(() => searchInput.focus(), 50);
                        }
                    }
                }
            });

            document.addEventListener('click', () => {
                const list = document.getElementById('waDropdownList');
                if (list) list.classList.remove('show');
            });
            
            // Character Preview Events
            const charSelect = document.getElementById('waCharacterSelect');
            
            if (charSelect) {
                charSelect.addEventListener('change', (e) => {
                    this.selectedCharacter = e.target.value;
                    this.updateScriptDisplay();
                    this.injectDynamicScript();
                });
            }
        },

        renderCharacterDropdown: function() {
            const select = document.getElementById('waCharacterSelect');
            const previewBtn = document.getElementById('waPreviewBtn');
            
            if (!select || !this.vrmModels || this.vrmModels.length === 0) return;
            
            select.innerHTML = '';
            
            this.vrmModels.forEach(model => {
                const opt = document.createElement('option');
                opt.value = model;
                opt.textContent = model;
                select.appendChild(opt);
            });
            
            if (!this.selectedCharacter) {
                this.selectedCharacter = this.vrmModels.includes('Botnoi') ? 'Botnoi' : this.vrmModels[0];
            }
            
            select.value = this.selectedCharacter;
            this.updateScriptDisplay();
        },

        updateScriptDisplay: function() {
            const versionNum = this.currentVersion === 'v1' ? '1' : '2';
            const speakerId = this.selectedSpeaker ? this.selectedSpeaker.speaker_id : '13';
            const avatarName = this.selectedCharacter || 'Botnoi'; // Use selected character
            
            const scriptHtml = `&lt;<span class="wa-c-tag">script</span> <span class="wa-c-attr">src</span>=<span class="wa-c-str">"https://webavatar.didthat.cc/chat-widget.js"</span>
    <span class="wa-c-attr">data-bot-id</span>=<span class="wa-c-str">"${this.botId}"</span>
    <span class="wa-c-attr">data-bnv-version</span>=<span class="wa-c-str">"${versionNum}"</span>
    <span class="wa-c-attr">data-bnv-speaker</span>=<span class="wa-c-str">"${speakerId}"</span>
    <span class="wa-c-attr">data-avatar-url</span>=<span class="wa-c-str">"${avatarName}"</span>&gt;
&lt;/<span class="wa-c-tag">script</span>&gt;`;

            const displayTarget = document.getElementById('waScriptDisplay');
            if (displayTarget) {
                displayTarget.innerHTML = scriptHtml;
            }
        },

        fetchSpeakers: async function() {
            try {
                const res = await fetch('https://bnv-list-zb2xurnl2a-as.a.run.app');
                const data = await res.json();
                
                if (data.v1 && data.v1.data) this.speakersData.v1 = data.v1.data;
                if (data.v2 && data.v2.data) this.speakersData.v2 = data.v2.data;

                this.setVersion('v1'); // initialize with v1
            } catch (error) {
                console.error('Failed to fetch speakers:', error);
                document.getElementById('waDropdownSelected').innerHTML = `<span style="color: #ef4444; font-size: 14px;">${this.t('errorLoadingSpeakers')}</span>`;
            }
        },

        setVersion: function(version) {
            this.currentVersion = version;
            document.getElementById('waBtnV1').classList.toggle('active', version === 'v1');
            document.getElementById('waBtnV2').classList.toggle('active', version === 'v2');
            
            const speakers = this.speakersData[version];
            if (speakers.length > 0) {
                // Determine default speaker ID based on version
                const defaultSpeakerId = version === 'v1' ? '13' : '70';
                
                // Find the default speaker, fallback to the first one if not found
                const defaultSpeaker = speakers.find(s => String(s.speaker_id) === defaultSpeakerId) || speakers[0];
                
                this.selectSpeaker(defaultSpeaker); 
                this.renderDropdownList(speakers);
            } else {
                this.selectedSpeaker = null;
                document.getElementById('waDropdownSelected').innerHTML = `<span style="color: #6b7280; font-size: 14px;">${this.t('noSpeakers')}</span>`;
                document.getElementById('waDropdownList').innerHTML = '';
                this.updateScriptDisplay();
            }
            
            this.injectDynamicScript();
        },

        renderDropdownList: function(speakers) {
            const listContainer = document.getElementById('waDropdownList');
            listContainer.innerHTML = '';

            // Add search input
            const searchContainer = document.createElement('div');
            searchContainer.className = 'wa-setup-search-container';
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.className = 'wa-setup-search-input';
            searchInput.placeholder = this.t('searchSpeakers');
            searchContainer.appendChild(searchInput);
            listContainer.appendChild(searchContainer);
            
            searchContainer.addEventListener('click', (e) => e.stopPropagation());

            const itemsContainer = document.createElement('div');
            listContainer.appendChild(itemsContainer);

            const renderItems = (filterText) => {
                itemsContainer.innerHTML = '';
                const query = filterText.toLowerCase().trim();
                const filtered = speakers.filter(s => {
                    const eng = (s.eng_name || '').toLowerCase();
                    const thai = (s.thai_name || '').toLowerCase();
                    return eng.includes(query) || thai.includes(query);
                });
                
                if (filtered.length === 0) {
                    itemsContainer.innerHTML = `<div style="padding: 16px; text-align: center; color: #6b7280; font-size: 13px;">${this.t('noResults')}</div>`;
                    return;
                }

                filtered.forEach(speaker => {
                    const item = document.createElement('div');
                    item.className = 'wa-setup-dropdown-item';
                    
                    const imgSrc = speaker.face_image || speaker.image || '';
                    const langs = speaker.available_language ? Array.isArray(speaker.available_language) ? speaker.available_language.join(', ').toUpperCase() : speaker.available_language.toUpperCase() : 'TH';
                    const displayName = this.uiLang === 'th' && speaker.thai_name ? speaker.thai_name : (speaker.eng_name || '');
                    const gender = this.uiLang === 'th' && speaker.gender ? speaker.gender : (speaker.eng_gender || '');
                    const ageStyle = this.uiLang === 'th' && speaker.age_style ? speaker.age_style : (speaker.eng_age_style || '');
                    
                    item.innerHTML = `
                        <img data-src="${imgSrc}" class="wa-speaker-img wa-lazy-image" alt="${displayName}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjZTVlN2ViJy8+PC9zdmc+'" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjZTVlN2ViJy8+PC9zdmc+" />
                        <div class="wa-speaker-info">
                            <div class="wa-speaker-name">${displayName}</div>
                            <div class="wa-speaker-desc">${gender} • ${ageStyle} • ${langs}</div>
                        </div>
                    `;

                    // Play Button
                    const btnWrap = document.createElement('div');
                    const playBtn = document.createElement('button');
                    playBtn.className = 'wa-speaker-play';
                    if (speaker.audio) playBtn.setAttribute('data-audio-src', speaker.audio);
                    playBtn.innerHTML = `
                        <svg viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    `;
                    
                    playBtn.addEventListener('click', (e) => {
                        e.stopPropagation(); // prevent selecting the item
                        if (speaker.audio) {
                            if (this.audioElement.src !== speaker.audio || this.audioElement.paused) {
                                this.audioElement.src = speaker.audio;
                                this.audioElement.play().catch(console.error);
                            } else {
                                this.audioElement.pause();
                            }
                        } else {
                            alert(this.t('noAudioSample'));
                        }
                    });

                    btnWrap.appendChild(playBtn);
                    item.appendChild(btnWrap);

                    // Select Item Event
                    item.addEventListener('click', () => {
                        this.selectSpeaker(speaker);
                        document.getElementById('waDropdownList').classList.remove('show');
                        this.injectDynamicScript();
                    });

                    itemsContainer.appendChild(item);
                });
                
                this.updatePlayButtons();
                
                // Initialize Lazy Loading Observer
                if ('IntersectionObserver' in window) {
                    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const lazyImage = entry.target;
                                const originalSrc = lazyImage.getAttribute('data-src');
                                if (originalSrc) {
                                    lazyImage.src = originalSrc;
                                }
                                lazyImage.classList.remove('wa-lazy-image');
                                observer.unobserve(lazyImage);
                            }
                        });
                    }, {
                        root: document.getElementById('waDropdownList'), // Observe relative to the scrolling dropdown
                        rootMargin: "300px 0px 600px 0px" // Pre-load images well before they become visible (above and below)
                    });

                    const lazyImages = itemsContainer.querySelectorAll('.wa-lazy-image');
                    lazyImages.forEach(lazyImage => {
                        lazyImageObserver.observe(lazyImage);
                    });
                } else {
                    // Fallback for older browsers
                    const lazyImages = itemsContainer.querySelectorAll('.wa-lazy-image');
                    lazyImages.forEach(lazyImage => {
                        lazyImage.src = lazyImage.getAttribute('data-src');
                        lazyImage.classList.remove('wa-lazy-image');
                    });
                }
            };

            searchInput.addEventListener('input', (e) => {
                renderItems(e.target.value);
            });
            
            renderItems(''); // Initial render
        },

        selectSpeaker: function(speaker) {
            this.selectedSpeaker = speaker;
            const selectedContainer = document.getElementById('waDropdownSelected');
            const imgSrc = speaker.face_image || speaker.image || '';
            const displayName = this.uiLang === 'th' && speaker.thai_name ? speaker.thai_name : (speaker.eng_name || '');
            
            selectedContainer.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <img src="${imgSrc}" class="wa-speaker-img" alt="${displayName}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjZTVlN2ViJy8+PC9zdmc+'" style="margin-bottom: 0;" />
                    <div>
                        <div class="wa-speaker-name">${displayName}</div>
                        <div class="wa-speaker-desc">${this.t('speakerId')} ${speaker.speaker_id}</div>
                    </div>
                </div>
                <span style="border-top: 5px solid #6b7280; border-left: 5px solid transparent; border-right: 5px solid transparent; margin-left: 8px;"></span>
            `;

            this.updateScriptDisplay();
        },

        fetchBnvState: async function() {
            const endpoint = `https://webavatar-bnv-map-zb2xurnl2a-as.a.run.app?bot_id=${this.botId}`;
            const inputField = document.getElementById('waBnvKeyInput');
            const saveBtn = document.getElementById('waBnvSaveBtn');
            const errorText = document.getElementById('waBnvErrorText');
            
            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                const isStored = data.exists === true;
                
                inputField.disabled = false;
                saveBtn.disabled = false;
                inputField.placeholder = 'b3FId29Ea.....';
                
                if (isStored) {
                    inputField.value = '•'.repeat(48);
                    this.isBnvStored = true;
                    this.injectDynamicScript();
                } else {
                    inputField.value = '';
                    this.isBnvStored = false;
                }
            } catch (error) {
                console.error("Failed to fetch BNV state:", error);
                inputField.placeholder = this.t('errorCheckBnvState');
                // Even on error, we can allow inputting a new one
                inputField.disabled = false;
                saveBtn.disabled = false;
            }
            errorText.style.display = 'none';
        },

        saveBnvKey: async function() {
            const inputField = document.getElementById('waBnvKeyInput');
            const errorText = document.getElementById('waBnvErrorText');
            const key = inputField.value.trim();

            errorText.style.display = 'none'; // reset previous errors

            // Allow bypass if they're saving the dummy dots back
            if (key === '•'.repeat(48)) {
                return; // Nothing to change
            }

            if (key.length !== 48 || !key.endsWith('==')) {
                errorText.innerText = this.t('invalidBnvKey');
                errorText.style.display = 'block';
                return;
            }

            const saveBtn = document.getElementById('waBnvSaveBtn');
            saveBtn.disabled = true;
            const originalText = saveBtn.innerText;
            saveBtn.innerText = this.t('saving');

            try {
                const response = await fetch('https://webavatar-bnv-map-zb2xurnl2a-as.a.run.app', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        bot_id: this.botId,
                        bnv_key: key
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Update field to dots
                    inputField.value = '•'.repeat(48);
                    saveBtn.innerText = this.t('saved');
                    this.isBnvStored = true;
                    this.injectDynamicScript();
                    setTimeout(() => {
                        saveBtn.innerText = originalText;
                        saveBtn.disabled = false;
                    }, 2000);
                } else {
                    const errorMsg = data.message || "Unknown error occurred";
                    throw new Error("Failed to save: " + errorMsg);
                }
            } catch (error) {
                console.error("Failed to save BNV key:", error);
                errorText.innerText = this.t('saveFailedBnvKey');
                errorText.style.display = 'block';
                saveBtn.innerText = originalText;
                saveBtn.disabled = false;
            }
        },

        injectDynamicScript: function() {
            if (!this.isBnvStored) return;

            // Remove existing instances if present
            const oldWidget = document.getElementById('botnoi-chat-widget');
            if (oldWidget) oldWidget.remove();

            const oldScript = document.getElementById('wa-dynamic-injected-script');
            if (oldScript) oldScript.remove();
            
            // Run all registered disconnect handlers to purge any async/mid-flight widget loads
            if (window._bcwDisconnects && window._bcwDisconnects.length > 0) {
                window._bcwDisconnects.forEach(disconnectFn => {
                    try { disconnectFn(); } catch (e) {}
                });
                window._bcwDisconnects = [];
            } else if (window.botnoiApp && typeof window.botnoiApp.disconnect === 'function') {
                window.botnoiApp.disconnect();
            }
            
            // Revert native avatar connection if it was running independently
            if (window.WebAvatar) {
                try { window.WebAvatar.disconnect(); } catch(e) {}
            }

            const versionNum = this.currentVersion === 'v1' ? '1' : '2';
            const speakerId = this.selectedSpeaker ? this.selectedSpeaker.speaker_id : '13';
            const avatarName = this.selectedCharacter || 'Botnoi';

            const newScript = document.createElement('script');
            newScript.id = 'wa-dynamic-injected-script';
            newScript.src = './chat-widget.js?t=' + Date.now();
            newScript.setAttribute('data-bot-id', this.botId);
            newScript.setAttribute('data-bnv-version', versionNum);
            newScript.setAttribute('data-bnv-speaker', speakerId);
            newScript.setAttribute('data-avatar-url', avatarName);

            document.body.appendChild(newScript);
        }
    };

    window.WebAvatarSetup = WebAvatarSetup;
})();
