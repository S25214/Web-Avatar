(function () {
    // Only define if not already defined
    if (window.AvatarWidget) return;

    // Singleton instance
    let widgetInstance = null;

    class AvatarWidget {
        constructor(options = {}) {
            this.width = options.width || 1000;
            this.height = options.height || 1000;
            this.position = options.position || 'bottom-right'; // bottom-right, bottom-left
            this.offsetX = -350 + ((options.offset && options.offset.x) || 0);
            this.offsetY = -250 + ((options.offset && options.offset.y) || 0);
            this.border = options.border || false; // Debug border option
            this.modelUrl = options.modelUrl || 'Kitagawa';
            this.defaultAnimationUrl = options.defaultAnimationUrl || 'Idleloop';
            this.cameraTarget = options.cameraTarget || { x: 0, y: 0, z: 0 };
            this.animationUrl = options.animationUrl || 'Greeting';
            this.onAnimationLoaded = options.onAnimationLoaded || null;
            this.corsProxy = options.corsProxy || "https://cors.didthat.workers.dev/?";

            // Dependencies place holder
            this.THREE = null;
            this.GLTFLoader = null;
            this.VRMLoaderPlugin = null;
            this.VRMUtils = null;
            this.VRMAnimationLoaderPlugin = null;
            this.createVRMAnimationClip = null;

            // Internal State
            this.scene = null;
            this.camera = null;
            this.defaultCameraTarget = { x: 0, y: 1.5, z: 7 };
            this.renderer = null;
            this.currentVrm = null;
            this.mixer = null;
            this.currentAction = null;
            this.clock = null;
            this.container = null;
            this.clipCache = new Map();
            this.isTransitioning = false;
            this.animationFrameId = null;

            // Blink
            this.blinkEnabled = true;
            this.blinkAnimating = false;
            this.blinkTimeout = null;

            // Audio
            this.audioContext = null;
            this.analyser = null;
            this.gainNode = null;
            this.audioElement = null;
            this.mediaSource = null;
            this.lipsyncEnabled = true;
            this.lipsyncSensitivity = 1;
            this.smoothedVolume = 1;
            this.fftSize = 1024;
            this.bufferLength = 0;
            this.dataArray = null;
            this.volume = 1.0;

            this.vowelState = { aa: 0, ih: 0, ou: 0, ee: 0, oh: 0 };

            // Manifest & Base URL
            this.manifest = null;
            this.baseUrl = options.baseUrl || this._detectBaseUrl();
        }

        _detectBaseUrl() {
            // Priority 1: document.currentScript (if script is loaded normally)
            if (document.currentScript && document.currentScript.src) {
                return document.currentScript.src.substring(0, document.currentScript.src.lastIndexOf('/') + 1);
            }

            // Priority 2: Try to find the script by filename
            const scripts = document.getElementsByTagName('script');
            for (let script of scripts) {
                if (script.src && script.src.includes('avatar-widget.js')) {
                    return script.src.substring(0, script.src.lastIndexOf('/') + 1);
                }
            }

            // Fallback
            return './';
        }

        async init() {
            // Ensure DOM is ready before creating elements
            if (document.readyState === 'loading') {
                await new Promise(resolve => window.addEventListener('DOMContentLoaded', resolve));
            }

            try {
                // 0. Load Manifest (Parallel with other initial setups if possible, but strictly before model load)
                await this._loadManifest();

                // 1. Setup Environment (Imports)
                await this._injectImportMap();
                await this._loadDependencies();

                // 2. Initialize 3D Scene
                this.clock = new this.THREE.Clock();
                this._createContainer();
                this._initThree();
                await this._loadModel();
                this._animate();
                this.setCameraPosition(this.cameraTarget.x, this.cameraTarget.y, this.cameraTarget.z);

                window.addEventListener('resize', this._onResizeBound = () => this._onResize());
                console.log("Avatar Widget Initialized");
            } catch (e) {
                console.error("Avatar Widget Initialization Failed:", e);
            }
        }

        async _loadManifest() {
            try {
                const manifestUrl = `${this.baseUrl}manifest.json`;
                const response = await fetch(manifestUrl);
                if (response.ok) {
                    this.manifest = await response.json();
                } else {
                    console.warn(`Failed to load manifest from ${manifestUrl}. using fallback/empty asset lists.`);
                    this.manifest = { VRM: [], VRMA: [] };
                }
            } catch (e) {
                console.warn("Error loading manifest:", e);
                this.manifest = { VRM: [], VRMA: [] };
            }
        }

        getModels() {
            return this.manifest && this.manifest.VRM ? this.manifest.VRM : [];
        }

        getAnimations() {
            return this.manifest && this.manifest.VRMA ? this.manifest.VRMA : [];
        }

        async _injectImportMap() {
            if (!document.querySelector('script[type="importmap"]')) {
                const importmap = document.createElement('script');
                importmap.type = 'importmap';
                importmap.textContent = JSON.stringify({
                    "imports": {
                        "three": "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js",
                        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.176.0/examples/jsm/",
                        "@pixiv/three-vrm": "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm@3/lib/three-vrm.module.min.js",
                        "@pixiv/three-vrm-animation": "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm-animation@3/lib/three-vrm-animation.module.min.js"
                    }
                });
                document.head.appendChild(importmap);
                // Give browser a moment to register imports
                await new Promise(r => setTimeout(r, 10));
            }
        }

        async _loadDependencies() {
            // Parallel load
            const [THREE, GLTFLoaderParams, ThreeVRM, ThreeVRMAnim] = await Promise.all([
                import('three'),
                import('three/addons/loaders/GLTFLoader.js'),
                import('@pixiv/three-vrm'),
                import('@pixiv/three-vrm-animation')
            ]);

            this.THREE = THREE;
            this.GLTFLoader = GLTFLoaderParams.GLTFLoader;
            this.VRMLoaderPlugin = ThreeVRM.VRMLoaderPlugin;
            this.VRMUtils = ThreeVRM.VRMUtils;
            this.VRMAnimationLoaderPlugin = ThreeVRMAnim.VRMAnimationLoaderPlugin;
            this.createVRMAnimationClip = ThreeVRMAnim.createVRMAnimationClip;
        }

        _createContainer() {
            this.container = document.createElement('div');
            this.container.id = 'avatar-widget-container';
            Object.assign(this.container.style, {
                position: 'fixed',
                top: this.position === 'top-right' || this.position === 'top-left' ? `${this.offsetY}px` : 'auto',
                bottom: this.position === 'bottom-right' || this.position === 'bottom-left' ? `${this.offsetY}px` : 'auto',
                right: this.position === 'top-right' || this.position === 'bottom-right' ? `${this.offsetX}px` : 'auto',
                left: this.position === 'top-left' || this.position === 'bottom-left' ? `${this.offsetX}px` : 'auto',
                width: `${this.width}px`,
                height: `${this.height}px`,
                zIndex: '9999',
                pointerEvents: 'none',
                border: this.border ? '1px solid red' : 'none'
            });
            document.body.appendChild(this.container);
        }

        _initThree() {
            this.scene = new this.THREE.Scene();

            this.camera = new this.THREE.PerspectiveCamera(30, this.width / this.height, 0.1, 20.0);
            this.camera.position.set(this.defaultCameraTarget.x, this.defaultCameraTarget.y, this.defaultCameraTarget.z);

            this.renderer = new this.THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.renderer.setSize(this.width, this.height);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.outputEncoding = this.THREE.sRGBEncoding;
            this.container.appendChild(this.renderer.domElement);

            const light = new this.THREE.DirectionalLight(0xffffff, 2);
            light.position.set(1.0, 1.0, 1.0).normalize();
            this.scene.add(light);

            const ambientLight = new this.THREE.AmbientLight(0xffffff, 1);
            this.scene.add(ambientLight);
        }

        async _loadModel() {
            let modelUrl = this.modelUrl;

            // Resolve Model URL from Manifest if it's a simple name
            if (this.manifest && this.manifest.VRM.includes(modelUrl)) {
                modelUrl = `${this.baseUrl}VRM/${modelUrl}.vrm`;
            } else if (modelUrl && !modelUrl.includes('/') && !modelUrl.startsWith('http') && !modelUrl.startsWith('.')) {
                // Try to guess even if not in manifest (fallback)
                modelUrl = `${this.baseUrl}VRM/${modelUrl}`;
            }


            if (!modelUrl) {
                console.error('No model URL provided');
                return;
            }

            const loader = new this.GLTFLoader();
            loader.crossOrigin = 'anonymous';
            loader.register((parser) => {
                return new this.VRMLoaderPlugin(parser);
            });
            loader.register((parser) => {
                return new this.VRMAnimationLoaderPlugin(parser);
            });

            try {
                const gltf = await loader.loadAsync(modelUrl);
                const vrm = gltf.userData.vrm;

                this.VRMUtils.removeUnnecessaryVertices(gltf.scene);
                this.VRMUtils.combineSkeletons(gltf.scene);
                this.VRMUtils.combineMorphs(vrm);

                vrm.scene.rotation.y = Math.PI;

                vrm.scene.traverse((obj) => {
                    obj.frustumCulled = false;
                });

                this.scene.add(vrm.scene);
                this.currentVrm = vrm;
                this.mixer = new this.THREE.AnimationMixer(vrm.scene);
                this.camera.lookAt(0, 0.8, 0);

                this.scheduleNextBlink();

                const animToLoad = this.animationUrl || this.defaultAnimationUrl;
                if (animToLoad) {
                    await this.loadAnimation(animToLoad); // Use public method for resolution
                }

            } catch (error) {
                console.error('Failed to load VRM:', error);
            }
        }

        async _loadAnimation(url, vrm) {
            try {
                let clip = this.clipCache.get(url);

                if (!clip) {
                    const loader = new this.GLTFLoader();
                    loader.crossOrigin = 'anonymous';
                    loader.register((parser) => {
                        return new this.VRMAnimationLoaderPlugin(parser);
                    });

                    const gltf = await loader.loadAsync(url);
                    const vrmAnimationData = gltf.userData.vrmAnimations && gltf.userData.vrmAnimations[0];

                    if (vrmAnimationData) {
                        clip = this.createVRMAnimationClip(vrmAnimationData, vrm);
                        this.clipCache.set(url, clip);
                    }
                }

                if (clip && this.mixer) {
                    const newAction = this.mixer.clipAction(clip);
                    const fileName = url.split('/').pop().toLowerCase();
                    const isDefault = url.includes(this.defaultAnimationUrl.split('/').pop());
                    const shouldLoop = isDefault || fileName.includes('loop');

                    if (shouldLoop) {
                        newAction.setLoop(this.THREE.LoopRepeat);
                        newAction.clampWhenFinished = false;
                    } else {
                        newAction.setLoop(this.THREE.LoopOnce);
                        newAction.clampWhenFinished = true;
                    }

                    // Prepare transition
                    newAction.reset();

                    if (this.currentAction && this.currentAction !== newAction) {
                        // 1.0 second blend
                        this.currentAction.crossFadeTo(newAction, 1.0);
                        newAction.play();
                    } else {
                        newAction.play();
                    }

                    this.currentAction = newAction;

                    // Reset transitioning flag if we just loaded the default loop (or any loop)
                    if (shouldLoop) {
                        this.isTransitioning = false;
                    }

                    if (this.onAnimationLoaded) {
                        this.onAnimationLoaded(url);
                    }
                }
            } catch (e) {
                console.error("Failed to load animation:", e);
                this.isTransitioning = false; // Reset on failure so we can try again
            }
        }

        _initAudio() {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = this.fftSize;
                this.bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(this.bufferLength);
                this.gainNode = this.audioContext.createGain();
                this.gainNode.connect(this.audioContext.destination);
                this.analyser.connect(this.gainNode);
            }
        }

        async playAudio(source) {
            this._initAudio();
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            this.stopAudio();

            let isUrl = false;
            if ((source.startsWith('http') || source.startsWith('./') || source.startsWith('/')) && !source.startsWith('data:')) {
                isUrl = true;
            }

            let playbackSource = source;
            let isBlob = false;

            if (isUrl) {
                try {
                    const response = await fetch(source);
                    if (response.ok) {
                        const blob = await response.blob();
                        playbackSource = URL.createObjectURL(blob);
                        isBlob = true;
                    } else {
                        throw new Error(`Fetch status: ${response.status}`);
                    }
                } catch (err) {
                    try {
                        let proxyUrl = this.corsProxy;
                        if (proxyUrl.includes('?')) {
                            proxyUrl += (proxyUrl.endsWith('?') ? "" : "&") + "url=" + encodeURIComponent(source);
                        } else {
                            proxyUrl += "?url=" + encodeURIComponent(source);
                        }
                        const proxyResp = await fetch(proxyUrl);
                        if (proxyResp.ok) {
                            const blob = await proxyResp.blob();
                            playbackSource = URL.createObjectURL(blob);
                            isBlob = true;
                        }
                    } catch (proxyErr) {
                        console.error("Proxy fetch error:", proxyErr);
                    }
                }
            } else if (!source.startsWith('data:audio') && !isUrl) {
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
                this.setExpression('aa', 0);
                this.setExpression('ih', 0);
                this.setExpression('ou', 0);
                this.setExpression('ee', 0);
                this.setExpression('oh', 0);
                if (isBlob) URL.revokeObjectURL(playbackSource);
            };
            this.audioElement.onended = onEnded;
            this.audioElement.onerror = (e) => {
                // Fallback attempt
                if (!isLocal && this.audioElement.crossOrigin === "anonymous") {
                    this.audioElement = new Audio();
                    this.audioElement.src = playbackSource;
                    this.audioElement.volume = this.volume;
                    this.audioElement.onended = onEnded;
                    this.mediaSource = null;
                    this.audioElement.play().catch(err => console.error("Retry playback failed:", err));
                }
            };

            try {
                this.mediaSource = this.audioContext.createMediaElementSource(this.audioElement);
                this.mediaSource.connect(this.analyser);
                await this.audioElement.play();
            } catch (e) {
                console.error("Audio Playback Error:", e);
            }
        }

        stopAudio() {
            if (this.audioElement) {
                this.audioElement.pause();
                this.audioElement.src = "";
                this.audioElement = null;
            }
            if (this.mediaSource) {
                this.mediaSource.disconnect();
                this.mediaSource = null;
            }
            this.setExpression('aa', 0);
            this.setExpression('ih', 0);
            this.setExpression('ou', 0);
            this.setExpression('ee', 0);
            this.setExpression('oh', 0);
        }

        setVolume(value) {
            this.volume = Math.max(0, Math.min(1, value));
            if (this.gainNode) this.gainNode.gain.value = this.volume;
            if (this.audioElement) this.audioElement.volume = this.volume;
        }

        setCameraPosition(x, y, z) {
            if (this.camera) {
                this.camera.position.set(this.defaultCameraTarget.x + x, this.defaultCameraTarget.y + y, this.defaultCameraTarget.z + z);
                this.cameraTarget = { x, y, z };
            }
        }

        _animate() {
            this.animationFrameId = requestAnimationFrame(() => this._animate());
            const deltaTime = this.clock.getDelta();
            if (this.mixer) {
                this.mixer.update(deltaTime);

                // Check if we need to transition back to default
                if (this.currentAction && !this.isTransitioning) {
                    const clip = this.currentAction.getClip();
                    const isOneShot = this.currentAction.loop === this.THREE.LoopOnce;

                    if (isOneShot && this.currentAction.isRunning()) {
                        const duration = clip.duration;
                        const time = this.currentAction.time;
                        // effectiveTime handles time wrapping, but for LoopOnce, time usually just increases.
                        // However, we want remaining time.
                        const remaining = duration - time;

                        if (remaining <= 1.0) {
                            // Start blending back to default
                            this.isTransitioning = true;
                            this.loadAnimation(this.defaultAnimationUrl);
                        }
                    }
                }
            }
            if (this.currentVrm) this.currentVrm.update(deltaTime);
            if (this.lipsyncEnabled) this._updateLipSync(deltaTime);
            if (this.renderer) this.renderer.render(this.scene, this.camera);
        }

        _updateLipSync(deltaTime) {
            if (!this.analyser || !this.audioElement || this.audioElement.paused) return;
            this.analyser.getByteFrequencyData(this.dataArray);

            let sum = 0;
            const binCount = this.bufferLength;
            for (let i = 0; i < binCount; i++) sum += this.dataArray[i];
            const average = sum / binCount;

            const volume = Math.min(1, (average / 255) * 2.0 * this.lipsyncSensitivity);
            const smoothFactor = 0.2;
            this.smoothedVolume += (volume - this.smoothedVolume) * smoothFactor;

            if (this.smoothedVolume < 0.01) {
                this._smoothVowel('aa', 0);
                this._smoothVowel('ih', 0);
                this._smoothVowel('ou', 0);
                this._smoothVowel('ee', 0);
                this._smoothVowel('oh', 0);
                this._applyVowels();
                return;
            }

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

            const intensity = Math.min(1, this.smoothedVolume * 2.5);
            const tOU = (lowAvg / total) * intensity;
            const tOH = ((lowAvg / total) * 0.5) * intensity;
            const tAA = (midAvg / total) * intensity;
            const tIH = (highAvg / total) * intensity;
            const tEE = ((highAvg / total) * 0.5) * intensity;

            this._smoothVowel('aa', tAA);
            this._smoothVowel('ih', tIH);
            this._smoothVowel('ou', tOU);
            this._smoothVowel('ee', tEE);
            this._smoothVowel('oh', tOH);
            this._applyVowels();
        }

        _smoothVowel(key, target) {
            this.vowelState[key] += (target - this.vowelState[key]) * 0.2;
        }

        _applyVowels() {
            this.setExpression('aa', this.vowelState.aa);
            this.setExpression('ih', this.vowelState.ih);
            this.setExpression('ou', this.vowelState.ou);
            this.setExpression('ee', this.vowelState.ee);
            this.setExpression('oh', this.vowelState.oh);
        }

        _onResize() {
            // Placeholder: fixed widget
        }

        async loadModel(url) {
            if (this.currentVrm) {
                this.scene.remove(this.currentVrm.scene);
                this.VRMUtils.deepDispose(this.currentVrm.scene);
                this.currentVrm = null;
                this.currentAction = null;
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

            let animUrl = url;
            // Resolve Animation URL from Manifest if it's a simple name
            if (this.manifest && this.manifest.VRMA.includes(animUrl)) {
                animUrl = `${this.baseUrl}VRMA/${animUrl}.vrma`;
            } else if (animUrl && !animUrl.includes('/') && !animUrl.startsWith('http') && !animUrl.startsWith('.')) {
                // Try to guess even if not in manifest (fallback)
                animUrl = `${this.baseUrl}VRMA/${animUrl}`;
            }

            this.animationUrl = animUrl;
            await this._loadAnimation(animUrl, this.currentVrm);
        }

        setExpression(name, value) {
            if (this.currentVrm && this.currentVrm.expressionManager) {
                this.currentVrm.expressionManager.setValue(name, value);
            }
        }

        scheduleNextBlink() {
            if (!this.blinkEnabled) return;
            const interval = 2000 + Math.random() * 4000;
            this.blinkTimeout = setTimeout(() => {
                this.playBlink({ double: Math.random() < 0.2 });
                this.scheduleNextBlink();
            }, interval);
        }

        playBlink({ double = false } = {}) {
            if (!this.blinkEnabled || this.blinkAnimating || !this.currentVrm) return;
            this.blinkAnimating = true;
            const duration = 120 + Math.random() * 80;
            const start = performance.now();
            const animate = (now) => {
                const t = Math.min((now - start) / duration, 1);
                let blinkValue = t < 0.25 ? t / 0.25 : 1 - Math.pow((t - 0.25) / 0.75, 2);
                this.setBlink(blinkValue);
                if (t < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.setBlink(0);
                    if (double) {
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
            if (this.currentVrm?.expressionManager) {
                this.currentVrm.expressionManager.setValue('blink', value);
            }
        }

        disconnect() {
            console.log("Disconnecting Avatar Widget...");

            // 1. Stop Animation Loop
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }

            // 2. Stop Audio
            this.stopAudio();
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
            }

            // 3. Clear Timeouts
            if (this.blinkTimeout) {
                clearTimeout(this.blinkTimeout);
                this.blinkTimeout = null;
            }

            // 4. Dispose Three.js Resources
            if (this.scene) {
                // Dispose VRM
                if (this.currentVrm) {
                    this.scene.remove(this.currentVrm.scene);
                    if (this.VRMUtils) {
                        this.VRMUtils.deepDispose(this.currentVrm.scene);
                    }
                    this.currentVrm = null;
                }

                // Dispose anything else in Scene
                while (this.scene.children.length > 0) {
                    this.scene.remove(this.scene.children[0]);
                }
                this.scene = null;
            }

            if (this.renderer) {
                this.renderer.dispose();
                this.renderer.forceContextLoss();
                this.renderer.domElement = null;
                this.renderer = null;
            }

            if (this.mixer) {
                this.mixer.stopAllAction();
                this.mixer = null;
            }

            // 5. Remove DOM Elements
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
                this.container = null;
            }

            // 6. Remove Event Listeners
            if (this._onResizeBound) {
                window.removeEventListener('resize', this._onResizeBound);
            }

            console.log("Avatar Widget Disconnected");
        }
    }

    // Expose Global Object
    window.WebAvatar = {
        init: (options) => {
            if (!widgetInstance) {
                widgetInstance = new AvatarWidget(options);
                widgetInstance.init();
            } else {
                console.warn("WebAvatar is already initialized.");
            }
        },
        loadModel: (url) => {
            if (widgetInstance) widgetInstance.loadModel(url);
        },
        loadAnimation: (url) => {
            if (widgetInstance) widgetInstance.loadAnimation(url);
        },
        playAudio: (source) => {
            if (widgetInstance) widgetInstance.playAudio(source);
        },
        stopAudio: () => {
            if (widgetInstance) widgetInstance.stopAudio();
        },
        setVolume: (value) => {
            if (widgetInstance) widgetInstance.setVolume(value);
        },
        setCameraPosition: (x, y, z) => {
            if (widgetInstance) widgetInstance.setCameraPosition(x, y, z);
        },
        getModels: () => {
            return widgetInstance ? widgetInstance.getModels() : [];
        },
        getAnimations: () => {
            return widgetInstance ? widgetInstance.getAnimations() : [];
        },
        disconnect: () => {
            if (widgetInstance) {
                widgetInstance.disconnect();
                widgetInstance = null;
            }
        }
    };

})();
