import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { VRMAnimationLoaderPlugin, createVRMAnimationClip } from '@pixiv/three-vrm-animation';

export class AvatarWidget {
    constructor(options = {}) {
        this.width = options.width || 300;
        this.height = options.height || 400;
        this.position = options.position || 'bottom-right'; // bottom-right, bottom-left
        this.modelUrl = options.modelUrl;
        this.defaultAnimationUrl = options.defaultAnimationUrl || './VRMA/IdleSway.vrma';
        this.animationUrl = options.animationUrl || this.defaultAnimationUrl;
        this.onAnimationLoaded = options.onAnimationLoaded || null;

        this.corsProxy = options.corsProxy || "https://cors.didthat.workers.dev/?";

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.currentVrm = null;
        this.mixer = null;
        this.currentAction = null; // Track current action for cross-fading
        this.clock = new THREE.Clock();
        this.container = null;

        // Blink state
        this.blinkEnabled = true;
        this.blinkAnimating = false;
        this.blinkTimeout = null;

        // Audio & Lip-sync
        this.audioContext = null;
        this.analyser = null;
        this.gainNode = null;
        this.audioElement = null;
        this.mediaSource = null;
        this.lipsyncEnabled = true;
        this.lipsyncSensitivity = 1; // Multiplier for lip movement
        this.smoothedVolume = 1; // For smoothing transitions
        this.fftSize = 1024;
        this.bufferLength = 0;
        this.dataArray = null;
        this.volume = 1.0;

        // Vowel smoothing state
        this.vowelState = {
            aa: 0,
            ih: 0,
            ou: 0,
            ee: 0,
            oh: 0
        };
    }

    async init() {
        this._createContainer();
        this._initThree();
        await this._loadModel();
        this._animate();
        window.addEventListener('resize', () => this._onResize());
        console.log("Avatar Widget Initialized");
    }

    _createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'avatar-widget-container';
        Object.assign(this.container.style, {
            position: 'fixed',
            bottom: '0px',
            right: this.position === 'bottom-right' ? '0px' : 'auto',
            left: this.position === 'bottom-left' ? '0px' : 'auto',
            width: `${this.width}px`,
            height: `${this.height}px`,
            zIndex: '9999',
            pointerEvents: 'none'
        });
        document.body.appendChild(this.container);
    }

    _initThree() {
        this.scene = new THREE.Scene();

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 0.1, 20.0);
        this.camera.position.set(0.0, 1.0, 4.0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);

        // Light
        const light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(1.0, 1.0, 1.0).normalize();
        this.scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);
    }

    async _loadModel() {
        if (!this.modelUrl) {
            console.error('No model URL provided');
            return;
        }

        const loader = new GLTFLoader();
        loader.crossOrigin = 'anonymous';
        loader.register((parser) => {
            return new VRMLoaderPlugin(parser);
        });
        loader.register((parser) => {
            return new VRMAnimationLoaderPlugin(parser);
        });

        try {
            const gltf = await loader.loadAsync(this.modelUrl);
            const vrm = gltf.userData.vrm;

            // Optimizations & Fixes from sample
            VRMUtils.removeUnnecessaryVertices(gltf.scene);
            VRMUtils.combineSkeletons(gltf.scene);
            VRMUtils.combineMorphs(vrm);

            vrm.scene.rotation.y = Math.PI; // Face forward

            // Disable frustum culling to prevent T-pose/flicker if bounds are wrong
            vrm.scene.traverse((obj) => {
                obj.frustumCulled = false;
            });

            this.scene.add(vrm.scene);
            this.currentVrm = vrm;

            this.camera.lookAt(0.0, 1.0, 0.0);

            console.log('VRM Loaded', vrm);

            // Initialize mixer immediately for this VRM
            this.mixer = new THREE.AnimationMixer(vrm.scene);

            // Start blinking schedule
            this.scheduleNextBlink();

            // Load animation if provided
            const animToLoad = this.animationUrl || this.defaultAnimationUrl;
            if (animToLoad) {
                await this._loadAnimation(animToLoad, vrm);
            }

        } catch (error) {
            console.error('Failed to load VRM:', error);
        }
    }

    async _loadAnimation(url, vrm) {
        try {
            const loader = new GLTFLoader();
            loader.crossOrigin = 'anonymous';
            loader.register((parser) => {
                return new VRMAnimationLoaderPlugin(parser);
            });

            const gltf = await loader.loadAsync(url);
            const vrmAnimationData = gltf.userData.vrmAnimations && gltf.userData.vrmAnimations[0];

            if (vrmAnimationData) {
                const clip = createVRMAnimationClip(vrmAnimationData, vrm);

                if (this.mixer) {
                    const newAction = this.mixer.clipAction(clip);

                    // Determine if this is the default animation or explicit loop
                    // We compare basenames to avoid path issues or exact string matches if paths vary slightly
                    const fileName = url.split('/').pop().toLowerCase();
                    const isDefault = url.includes(this.defaultAnimationUrl.split('/').pop());
                    const shouldLoop = isDefault || fileName.includes('loop');

                    if (shouldLoop) {
                        newAction.setLoop(THREE.LoopRepeat);
                        newAction.clampWhenFinished = false;
                    } else {
                        newAction.setLoop(THREE.LoopOnce);
                        newAction.clampWhenFinished = true;

                        // When finished, go back to default
                        const onFinished = (e) => {
                            if (e.action === newAction) {
                                this.mixer.removeEventListener('finished', onFinished);
                                console.log(`Animation ${url} finished, returning to default: ${this.defaultAnimationUrl}`);
                                this.loadAnimation(this.defaultAnimationUrl);
                            }
                        };
                        this.mixer.addEventListener('finished', onFinished);
                    }

                    // Crossfade if there's an existing action
                    newAction.reset();
                    // newAction.play(); // Play called below

                    if (this.currentAction && this.currentAction !== newAction) {
                        this.currentAction.crossFadeTo(newAction, 0.5);
                        newAction.play();
                    } else {
                        newAction.play();
                    }

                    this.currentAction = newAction;
                    console.log(`Animation loaded: ${url} (Default/Loop: ${shouldLoop}, Loop: ${shouldLoop ? 'Repeat' : 'Once'})`);

                    if (this.onAnimationLoaded) {
                        this.onAnimationLoaded(url);
                    }
                }
            } else {
                console.warn("No VRMA animations found in file");
            }
        } catch (e) {
            console.error("Failed to load animation:", e);
        }
    }

    // Audio Implementation
    _initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.fftSize;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);

            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);

            // Connect analyser to gain (and thus destination), or vice versa depending on where we want to tap
            // Source -> Analyser -> Gain -> Destination
            this.analyser.connect(this.gainNode);
        }
    }

    async playAudio(source) {
        this._initAudio();

        // Resume context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        // Stop existing audio
        this.stopAudio();

        // Create Audio Element
        this.audioElement = new Audio();

        let isUrl = false;
        if ((source.startsWith('http') || source.startsWith('./') || source.startsWith('/')) && !source.startsWith('data:')) {
            isUrl = true;
        }

        let playbackSource = source;
        let isBlob = false;

        // Attempt to fetch remote audio to Blob if it's a URL
        if (isUrl) {
            try {
                console.log("Attempting to fetch audio for local blob playback:", source);
                const response = await fetch(source);
                if (response.ok) {
                    const blob = await response.blob();
                    playbackSource = URL.createObjectURL(blob);
                    isBlob = true;
                    console.log("Audio fetched successfully, playing from Blob:", playbackSource);
                } else {
                    console.warn("Fetch failed, falling back to direct URL", response.status);
                    throw new Error(`Fetch status: ${response.status}`);
                }
            } catch (err) {
                console.warn("Direct fetch failed (CORS likely). Attempting via CORS Proxy...", err);
                // RETRY WITH PROXY
                try {
                    let proxyUrl = this.corsProxy;
                    if (proxyUrl.includes('?')) {
                        if (proxyUrl.endsWith('?')) {
                            proxyUrl += "url=" + encodeURIComponent(source);
                        } else {
                            proxyUrl += "&url=" + encodeURIComponent(source);
                        }
                    } else {
                        proxyUrl += "?url=" + encodeURIComponent(source);
                    }
                    console.log("Fetching via proxy:", proxyUrl);
                    const proxyResp = await fetch(proxyUrl);
                    if (proxyResp.ok) {
                        const blob = await proxyResp.blob();
                        playbackSource = URL.createObjectURL(blob);
                        isBlob = true;
                        console.log("Audio fetched via Proxy!, playing from Blob:", playbackSource);
                    } else {
                        console.warn("Proxy fetch failed too.", proxyResp.status);
                    }
                } catch (proxyErr) {
                    console.error("Proxy fetch error:", proxyErr);
                    // Final fallback to direct URL (already set in playbackSource initial value)
                    // This will result in silent playback if CORS is blocked.
                }
            }
        } else if (!source.startsWith('data:audio') && !isUrl) {
            // Assume raw base64, add prefix
            playbackSource = `data:audio/mp3;base64,${source}`;
        }

        this.audioElement = new Audio();
        this.audioElement.src = playbackSource;

        const isLocal = isBlob || source.startsWith('data:') || playbackSource.startsWith('data:');

        if (!isLocal) {
            this.audioElement.crossOrigin = "anonymous";
        }

        this.audioElement.volume = this.volume;

        const onEnded = () => {
            console.log("Audio ended");
            this.setExpression('a', 0);
            this.setExpression('i', 0);
            this.setExpression('u', 0);
            this.setExpression('e', 0);
            this.setExpression('o', 0);

            if (isBlob) {
                URL.revokeObjectURL(playbackSource);
            }
        };
        this.audioElement.onended = onEnded;

        this.audioElement.onerror = (e) => {
            console.error("Audio Load Error:", e, this.audioElement.error);

            // Fallback for failed CORS URL (if direct URL playback failed)
            if (!isLocal && this.audioElement.crossOrigin === "anonymous") {
                console.warn("Retrying playback without CORS (Lip-sync disabled)");
                this.audioElement = new Audio();
                this.audioElement.src = playbackSource;
                this.audioElement.volume = this.volume;
                this.audioElement.onended = onEnded;
                this.mediaSource = null;
                this.audioElement.play().catch(err => console.error("Retry playback failed:", err));
            }
        }


        // Connect to Web Audio API
        try {
            // We only create media source if we think it's safe or we want lip sync
            // For Data URIs it's always safe. For URLs we try with CORS.

            this.mediaSource = this.audioContext.createMediaElementSource(this.audioElement);
            this.mediaSource.connect(this.analyser);

            console.log("Web Audio Graph Connected. Source:", isLocal ? "Local/DataURI" : "URL");

            // Play
            await this.audioElement.play();
            console.log("Audio playing...");
        } catch (e) {
            console.error("Error setting up audio/playing:", e);
        }
    }

    stopAudio() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.src = "";
            this.audioElement = null;
        }
        // Disconnect media source if exists to prevent memory leaks?
        // simple disconnect might be enough. 
        if (this.mediaSource) {
            this.mediaSource.disconnect();
            this.mediaSource = null;
        }

        // Reset mouth
        this.setExpression('a', 0);
        this.setExpression('i', 0);
        this.setExpression('u', 0);
        this.setExpression('e', 0);
        this.setExpression('o', 0);
    }

    setVolume(value) {
        // value between 0 and 1
        this.volume = Math.max(0, Math.min(1, value));

        if (this.gainNode) {
            this.gainNode.gain.value = this.volume;
        }

        if (this.audioElement) {
            this.audioElement.volume = this.volume;
        }
    }

    _animate() {
        requestAnimationFrame(() => this._animate());

        const deltaTime = this.clock.getDelta();

        // Update Mixer FIRST
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }

        // Then update VRM 
        if (this.currentVrm) {
            this.currentVrm.update(deltaTime);
        }

        if (this.lipsyncEnabled) {
            this._updateLipSync(deltaTime);
        }

        this.renderer.render(this.scene, this.camera);
    }

    _updateLipSync(deltaTime) {
        if (!this.analyser || !this.audioElement || this.audioElement.paused) return;

        this.analyser.getByteFrequencyData(this.dataArray);

        // Calculate average volume
        let sum = 0;
        const binCount = this.bufferLength;
        for (let i = 0; i < binCount; i++) {
            sum += this.dataArray[i];
        }
        const average = sum / binCount;

        // Debug Log (throttled)
        if (Math.random() < 0.01) {
            console.log("Lip-sync Avg Vol:", average, "Smoothed:", this.smoothedVolume);
        }

        // Normalize 0-255 to 0-1
        const volume = Math.min(1, (average / 255) * 2.0 * this.lipsyncSensitivity);

        // Global volume smoothing (slower attack, faster decay for responsiveness?? or simpler lerp)
        // Adjust smoothing factor: 0.1 = very smooth, 0.5 = responsive
        const smoothFactor = 0.2;
        this.smoothedVolume += (volume - this.smoothedVolume) * smoothFactor;

        // Threshold to avoid jitter when silent
        if (this.smoothedVolume < 0.01) {
            // Decay all vowels to 0
            this._smoothVowel('aa', 0);
            this._smoothVowel('ih', 0);
            this._smoothVowel('ou', 0);
            this._smoothVowel('ee', 0);
            this._smoothVowel('oh', 0);
            this._applyVowels();
            return;
        }

        // --- Improved Frequency Analysis for Vowel Mapping ---
        // Split spectrum into 3 bands roughly
        const lowBound = Math.floor(binCount * 0.1);
        const midBound = Math.floor(binCount * 0.4);

        let lowSum = 0, midSum = 0, highSum = 0;
        for (let i = 0; i < lowBound; i++) lowSum += this.dataArray[i];
        for (let i = lowBound; i < midBound; i++) midSum += this.dataArray[i];
        for (let i = midBound; i < binCount; i++) highSum += this.dataArray[i];

        const lowAvg = lowSum / lowBound;
        const midAvg = midSum / (midBound - lowBound);
        const highAvg = highSum / (binCount - midBound);

        const total = lowAvg + midAvg + highAvg + 0.001;
        const lowRatio = lowAvg / total;
        const midRatio = midAvg / total;
        const highRatio = highAvg / total;

        // Map ratios to vowels
        // Scale by smoothed volume so the mouth opens more when loud
        const intensity = Math.min(1, this.smoothedVolume * 2.5);

        // Targets for this frame
        let tAA = 0, tIH = 0, tOU = 0, tEE = 0, tOH = 0;

        // Soft blending instead of hard thresholds
        // Low -> OU, OH
        // Mid -> AA
        // High -> IH, EE

        tOU = lowRatio * intensity;
        tOH = (lowRatio * 0.5) * intensity;

        tAA = midRatio * intensity;

        tIH = highRatio * intensity;
        tEE = (highRatio * 0.5) * intensity;

        // Smooth individual vowels towards targets
        this._smoothVowel('aa', tAA);
        this._smoothVowel('ih', tIH);
        this._smoothVowel('ou', tOU);
        this._smoothVowel('ee', tEE);
        this._smoothVowel('oh', tOH);

        this._applyVowels();
    }

    _smoothVowel(key, target) {
        // Independent smoothing for each shape
        // 0.2 gives a nice organic lag
        const factor = 0.2;
        this.vowelState[key] += (target - this.vowelState[key]) * factor;
    }

    _applyVowels() {
        this.setExpression('aa', this.vowelState.aa);
        this.setExpression('ih', this.vowelState.ih);
        this.setExpression('ou', this.vowelState.ou);
        this.setExpression('ee', this.vowelState.ee);
        this.setExpression('oh', this.vowelState.oh);
    }

    _onResize() {
        // Fixed widget size
    }

    async loadModel(url) {
        if (this.currentVrm) {
            this.scene.remove(this.currentVrm.scene);
            VRMUtils.deepDispose(this.currentVrm.scene);
            this.currentVrm = null;
            this.currentAction = null; // Reset action

            // Clear any pending blink timeout
            if (this.blinkTimeout) {
                clearTimeout(this.blinkTimeout);
                this.blinkTimeout = null;
            }
        }

        this.modelUrl = url;
        await this._loadModel();
    }

    async loadAnimation(url) {
        if (!this.currentVrm) return;
        this.animationUrl = url; // Update current tracked url
        await this._loadAnimation(url, this.currentVrm);
    }

    getVRM() {
        return this.currentVrm;
    }

    setExpression(name, value) {
        if (this.currentVrm && this.currentVrm.expressionManager) {
            this.currentVrm.expressionManager.setValue(name, value);
        }
    }

    // Blink Logic
    scheduleNextBlink() {
        if (!this.blinkEnabled) return;

        const interval = 2000 + Math.random() * 4000; // between 2 and 6 sec

        this.blinkTimeout = setTimeout(() => {
            const doubleBlinkChance = Math.random() < 0.2; // 20% chance to blink twice in a row
            this.playBlink({ double: doubleBlinkChance });
            this.scheduleNextBlink();
        }, interval);
    }

    playBlink({ double = false } = {}) {
        if (!this.blinkEnabled || this.blinkAnimating || !this.currentVrm) return;

        this.blinkAnimating = true;

        const duration = 120 + Math.random() * 80; // ms
        const start = performance.now();

        const animate = (now) => {
            const t = Math.min((now - start) / duration, 1);

            let blinkValue;
            if (t < 0.25) {
                // fast close
                blinkValue = t / 0.25;
            } else {
                // slow open
                const k = (t - 0.25) / 0.75;
                blinkValue = 1 - (k * k);
            }

            this.setBlink(blinkValue);

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                this.setBlink(0);

                if (double) {
                    // second blink shortly after
                    setTimeout(() => {
                        this.blinkAnimating = false;
                        this.playBlink({ double: false });
                    }, 80 + Math.random() * 60);
                } else {
                    this.blinkAnimating = false;
                }
            }
        };

        requestAnimationFrame(animate);
    }

    setBlink(value) {
        if (!this.currentVrm?.expressionManager) return;
        this.currentVrm.expressionManager.setValue('blink', value);
    }
}
