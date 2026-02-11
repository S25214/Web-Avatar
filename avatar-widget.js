(function () {
    // Only define if not already defined
    if (window.AvatarWidget) return;

    // Singleton instance
    let widgetInstance = null;

    // Shared State (Module Scope)
    let manifest = null;
    let baseUrl = null;

    // --- Helper Functions ---

    function detectBaseUrl() {
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

    async function loadManifest() {
        if (manifest) return; // Already loaded

        if (!baseUrl) {
            baseUrl = detectBaseUrl();
        }

        try {
            const manifestUrl = `${baseUrl}manifest.json`;
            const response = await fetch(manifestUrl);
            if (response.ok) {
                manifest = await response.json();
            } else {
                console.warn(`Failed to load manifest from ${manifestUrl}. Using fallback/empty asset lists.`);
                manifest = { VRM: [], VRMA: [] };
            }
        } catch (e) {
            console.warn("Error loading manifest:", e);
            manifest = { VRM: [], VRMA: [] };
        }
    }

    // --- AvatarWidget Class ---

    class AvatarWidget {
        constructor(options = {}) {
            this.width = options.width || 1000;
            this.height = options.height || 1000;
            this.position = options.position || 'bottom-right';
            const isCenter = this.position.includes('center');
            const isCenterMiddle = this.position.startsWith('center');
            const defaultOffsetX = isCenter ? 0 : -350;
            const defaultOffsetY = isCenterMiddle ? -100 : -250;
            this.offsetX = defaultOffsetX + ((options.offset && options.offset.x) || 0);
            this.offsetY = defaultOffsetY + ((options.offset && options.offset.y) || 0);
            this.border = options.border || false;
            this.modelUrl = options.modelUrl || 'Kitagawa';

            // Support multiple default animations
            const defaultAnim = options.defaultAnimationUrl || ['Idleloop', 'idle_breatheloop', 'Idle_Swayloop', 'Idle_Offensive'];
            this.defaultAnimationUrls = Array.isArray(defaultAnim) ? defaultAnim : [defaultAnim];
            this.defaultAnimationUrl = this.defaultAnimationUrls[Math.floor(Math.random() * this.defaultAnimationUrls.length)];

            this.userCameraOffset = options.cameraTarget || { x: 0, y: 0, z: 0 }; // Renamed from cameraTarget to avoid confusion
            this.cameraLookAtTarget = { x: 0, y: 0.8, z: 0 }; // New: Explicit lookAt target

            this.animationUrl = options.animationUrl || 'Greeting';
            this.onAnimationLoaded = options.onAnimationLoaded || null;
            this.corsProxy = options.corsProxy || "https://cors.didthat.workers.dev/?";

            // Random Generic Animation / Idle Switching Settings
            this.randomGeneric = options.randomGeneric !== false; // Default true
            this.randomIntervalMin = options.randomIntervalMin || 15;
            this.randomIntervalMax = options.randomIntervalMax || 30;
            this.idleBehaviorTimeout = null;

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

            this.defaultCameraPosition = { x: 0, y: 1, z: 7 }; // Tweaked default for better standard view
            this.cameraYOffset = 0; // Simplified
            this.cameraFollowSpeed = 1.0; // Default follow speed
            this.currentLookAt = null; // Track current lookAt for smoothing - Initialized in _initThree

            // Root Motion & Transition State
            this.crossFadeDuration = 1.0;
            this.transitionTime = 0;
            this.transitionStartPos = null;
            this.isRootMotionTransitioning = false;

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

            // Initialize baseUrl if not already set (e.g., if preload wasn't called)
            if (!baseUrl) {
                baseUrl = options.baseUrl || detectBaseUrl();
            }
        }

        async init() {
            // Ensure DOM is ready before creating elements
            if (document.readyState === 'loading') {
                await new Promise(resolve => window.addEventListener('DOMContentLoaded', resolve));
            }

            try {
                // 0. Load Manifest (if not already loaded via preload)
                await loadManifest();

                // 1. Setup Environment (Imports)
                await this._injectImportMap();
                await this._loadDependencies();

                // 2. Initialize 3D Scene
                this.clock = new this.THREE.Clock();
                this._createContainer();
                this._initThree();
                await this._loadModel();
                this.initialHipsPos = null; // To track base hip position
                this._createFloorGrid();
                this._animate();
                // Initial camera set - we don't want to lerp from 0,0,0
                if (this.camera) {
                    this._updateCamera(0); // Force initial update
                }

                window.addEventListener('resize', this._onResizeBound = () => this._onResize());
                console.log("Avatar Widget Initialized");
            } catch (e) {
                console.error("Avatar Widget Initialization Failed:", e);
            }
        }

        // Renamed getModels to check shared manifest (instance method mainly for internal use or convenience)
        getModels() {
            return manifest && manifest.VRM ? manifest.VRM : [];
        }

        getAnimations() {
            return manifest && manifest.VRMA ? manifest.VRMA : [];
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

            const style = {
                position: 'fixed',
                width: `${this.width}px`,
                height: `${this.height}px`,
                zIndex: '9999',
                pointerEvents: 'none',
                border: this.border ? '1px solid red' : 'none'
            };

            switch (this.position) {
                case 'top-left':
                    style.top = `${this.offsetY}px`;
                    style.left = `${this.offsetX}px`;
                    break;
                case 'top-right':
                    style.top = `${this.offsetY}px`;
                    style.right = `${this.offsetX}px`;
                    break;
                case 'bottom-left':
                    style.bottom = `${this.offsetY}px`;
                    style.left = `${this.offsetX}px`;
                    break;
                case 'bottom-center':
                    style.bottom = `${this.offsetY}px`;
                    style.left = '50%';
                    style.transform = `translateX(-50%) translateX(${this.offsetX}px)`;
                    break;
                case 'top-center':
                    style.top = `${this.offsetY}px`;
                    style.left = '50%';
                    style.transform = `translateX(-50%) translateX(${this.offsetX}px)`;
                    break;
                case 'center':
                    style.top = '50%';
                    style.left = '50%';
                    style.transform = `translate(-50%, -50%) translate(${this.offsetX}px, ${this.offsetY}px)`;
                    break;
                case 'bottom-right':
                default:
                    style.bottom = `${this.offsetY}px`;
                    style.right = `${this.offsetX}px`;
                    break;
            }

            Object.assign(this.container.style, style);
            document.body.appendChild(this.container);
        }

        _initThree() {
            this.scene = new this.THREE.Scene();

            this.camera = new this.THREE.PerspectiveCamera(30, this.width / this.height, 0.1, 20.0);
            this.camera.position.set(this.defaultCameraPosition.x, this.defaultCameraPosition.y, this.defaultCameraPosition.z);

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

            // Create Avatar Group (Wrapper for Root Motion Simulation)
            this.avatarGroup = new this.THREE.Group();
            this.scene.add(this.avatarGroup);

            // Temporary Vector for reuse
            this.tempHipsPos = new this.THREE.Vector3();
            this.currentLookAt = new this.THREE.Vector3(0, 0.8, 0);
            this.transitionStartPos = new this.THREE.Vector3();

            this.gridUniforms = {
                uColor: { value: new this.THREE.Color(0x888888) },
                uGridSize: { value: 0.3 },
                uThickness: { value: 0.1 },
                uMaskCenter: { value: new this.THREE.Vector2(0, 0) },
                uMaskRadius: { value: 1.0 },
                uFade: { value: 1.0 }
            };
        }

        _createFloorGrid() {
            // Vertex Shader
            const vertexShader = `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * viewMatrix * worldPosition;
                }
            `;

            // Fragment Shader
            // Simple grid with radial fade
            const fragmentShader = `
                varying vec3 vWorldPosition;
                uniform vec3 uColor;
                uniform float uGridSize;
                uniform float uThickness;
                uniform vec2 uMaskCenter;
                uniform float uMaskRadius;
                uniform float uFade;

                void main() {
                    // Grid Logic (Standard analytical grid)
                    // Coordinate system based on world position
                    vec2 coord = vWorldPosition.xz / uGridSize;
                    
                    // Derivative-based anti-aliased grid lines
                    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
                    float line = min(grid.x, grid.y);
                    
                    // Invert: 1.0 at line center, 0.0 outside
                    float gridAlpha = 1.0 - min(line, 1.0);
                    
                    // Radial Mask Logic
                    // Calculate distance from center (hip projection on floor)
                    float dist = distance(vWorldPosition.xz, uMaskCenter);
                    
                    // Smoothstep for soft edge
                    // 1.0 inside radius, fading to 0.0 at radius + fade
                    // Or fading out from center? Usually "radial mask" means visible near center.
                    // Let's make it visible within radius, fade out at edge.
                    float mask = 1.0 - smoothstep(uMaskRadius - uFade, uMaskRadius, dist);
                    
                    // Combine
                    gl_FragColor = vec4(uColor, gridAlpha * mask * 0.5); // 0.5 base opacity
                    
                    // Discard strictly fully transparent pixels to avoid depth issues if any (though transparent: true handles it)
                    if (gl_FragColor.a < 0.01) discard;
                }
            `;

            const geometry = new this.THREE.PlaneGeometry(50, 50);
            const material = new this.THREE.ShaderMaterial({
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                uniforms: this.gridUniforms,
                transparent: true,
                side: this.THREE.DoubleSide,
                // extensions: { derivatives: true } // Standard in WebGL2, usually enabled by default or robustly supported
            });

            this.gridMesh = new this.THREE.Mesh(geometry, material);
            this.gridMesh.rotation.x = -Math.PI / 2; // Flat on floor
            this.gridMesh.position.y = 0.005; // Slightly above 0
            this.scene.add(this.gridMesh);
        }

        async _loadModel() {
            let modelUrl = this.modelUrl;

            // Resolve Model URL from Shared Manifest if it's a simple name
            if (manifest && manifest.VRM.includes(modelUrl)) {
                modelUrl = `${baseUrl}VRM/${modelUrl}.vrm`;
            } else if (modelUrl && !modelUrl.includes('/') && !modelUrl.startsWith('http') && !modelUrl.startsWith('.')) {
                // Try to guess even if not in manifest (fallback)
                modelUrl = `${baseUrl}VRM/${modelUrl}`;
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

                this.avatarGroup.add(vrm.scene);
                this.currentVrm = vrm;
                this.mixer = new this.THREE.AnimationMixer(vrm.scene);
                this.scheduleNextBlink();

                const animToLoad = this.animationUrl || this.defaultAnimationUrl;
                if (animToLoad) {
                    await this.loadAnimation(animToLoad); // Use public method for resolution
                } else {
                    // Try to start idle behavior loop if nothing loaded
                    this.scheduleNextIdleBehavior();
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
                    const isDefault = this._isDefaultAnimation(url);
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
                        this.currentAction.crossFadeTo(newAction, this.crossFadeDuration);
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
            // This sets the USER OFFSET, not the absolute position
            this.userCameraOffset = { x, y, z };
            // Immediate update not strictly necessary as _animate handles it, but good for responsiveness
            if (this.camera) {
                this._updateCamera(0.3);
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
                            // Pick a random default to return to
                            const nextDefault = this._getRandomDefaultAnimation();
                            this.loadAnimation(nextDefault);
                        }
                    }
                }
            }
            if (this.currentVrm) {
                this.currentVrm.update(deltaTime);

                // Recover local position drift from root motion simulation
                // Synchronized with crossfade to prevent sliding
                if (this.isRootMotionTransitioning) {
                    this.transitionTime += deltaTime;
                    let alpha = Math.min(this.transitionTime / this.crossFadeDuration, 1.0);

                    // Linear interpolation to match the crossfade weights
                    // Target is (0,0,0), so we just scale the starting offset
                    this.currentVrm.scene.position.copy(this.transitionStartPos).multiplyScalar(1.0 - alpha);

                    if (alpha >= 1.0) {
                        this.isRootMotionTransitioning = false;
                        this.currentVrm.scene.position.set(0, 0, 0);
                    }
                } else if (this.currentVrm.scene.position.lengthSq() > 0.0001) {
                    // Safety cleanup if we are not transitioning but somehow off-center
                    // (e.g. if crossfade interrupted or manual position set)
                    const speed = 2.0;
                    const currentPos = this.currentVrm.scene.position;
                    const target = new this.THREE.Vector3(0, 0, 0);
                    currentPos.lerp(target, 1.0 - Math.exp(-speed * deltaTime));
                }

                this._updateCamera(deltaTime);
            }
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
                this.avatarGroup.remove(this.currentVrm.scene);
                this.VRMUtils.deepDispose(this.currentVrm.scene);
                // Reset Avatar Group Position so new model starts at origin
                this.avatarGroup.position.set(0, 0, 0);
                this.avatarGroup.rotation.set(0, 0, 0);

                this.currentVrm = null;
                this.currentAction = null;
                this.initialHipsPos = null; // Reset tracking
                if (this.blinkTimeout) {
                    clearTimeout(this.blinkTimeout);
                    this.blinkTimeout = null;
                }
            }
            this.modelUrl = url;
            await this._loadModel();
        }

        async loadAnimation(url) {
            // Clear any pending idle behavior to "pause" the interval
            if (this.idleBehaviorTimeout) {
                clearTimeout(this.idleBehaviorTimeout);
                this.idleBehaviorTimeout = null;
            }

            if (!this.currentVrm) return;

            // --- Root Motion Simulation Refined ---
            // Move the avatarGroup (Global Root) to the hips position.
            // But counter-move the local VRM scene so there is no visual jump.
            // The local VRM scene then drifts back to 0 over time (in _animate).
            if (this.currentVrm) {
                const hips = this.currentVrm.humanoid?.getRawBoneNode('hips');
                if (hips) {
                    const hipsWorldPos = new this.THREE.Vector3();
                    const groupWorldPos = new this.THREE.Vector3();

                    hips.getWorldPosition(hipsWorldPos);
                    this.avatarGroup.getWorldPosition(groupWorldPos);

                    // Calculate Delta (World Hips - World Group Loop)
                    // We only care about X and Z for root motion on floor
                    const deltaX = hipsWorldPos.x - groupWorldPos.x;
                    const deltaZ = hipsWorldPos.z - groupWorldPos.z;

                    // 1. Move Global Group Forward
                    this.avatarGroup.position.x += deltaX;
                    this.avatarGroup.position.z += deltaZ;

                    // 2. Move Local VRM Backward (Counter-act)
                    this.currentVrm.scene.position.x -= deltaX;
                    this.currentVrm.scene.position.z -= deltaZ;

                    // Initialize Transition State for _animate to recover
                    this.transitionStartPos.copy(this.currentVrm.scene.position);
                    this.transitionTime = 0;
                    this.isRootMotionTransitioning = true;

                    // Update Matrices
                    this.avatarGroup.updateMatrixWorld(true);
                    this.currentVrm.scene.updateMatrixWorld(true);
                }
            }
            // -----------------------------

            let animUrl = url;
            // Resolve Animation URL from Shared Manifest if it's a simple name
            if (manifest && manifest.VRMA.includes(animUrl)) {
                animUrl = `${baseUrl}VRMA/${animUrl}.vrma`;
            } else if (animUrl && !animUrl.includes('/') && !animUrl.startsWith('http') && !animUrl.startsWith('.')) {
                // Try to guess even if not in manifest (fallback)
                animUrl = `${baseUrl}VRMA/${animUrl}`;
            }

            this.animationUrl = animUrl;
            await this._loadAnimation(animUrl, this.currentVrm);

            // If we just loaded a default loop, schedule the next idle behavior (generic or switch)
            if (this._isDefaultAnimation(animUrl)) {
                // Update current default if it changed (important for state tracking)
                // We don't strictly *need* to update this.defaultAnimationUrl based on logic above,
                // but implementation below relies on _isDefaultAnimation check.
                this.scheduleNextIdleBehavior();
            }
        }

        _getRandomDefaultAnimation() {
            if (!this.defaultAnimationUrls || this.defaultAnimationUrls.length === 0) return 'Idleloop';
            return this.defaultAnimationUrls[Math.floor(Math.random() * this.defaultAnimationUrls.length)];
        }

        _isDefaultAnimation(url) {
            if (!url) return false;
            // Check against current single default property
            if (url === this.defaultAnimationUrl || url.includes(this.defaultAnimationUrl.split('/').pop())) return true;

            // Check against the list of possibilities
            for (const defUrl of this.defaultAnimationUrls) {
                if (url === defUrl || url.includes(defUrl.split('/').pop())) return true;
            }
            return false;
        }

        scheduleNextIdleBehavior() {
            if (this.idleBehaviorTimeout) clearTimeout(this.idleBehaviorTimeout);

            // If randomGeneric is OFF and we only have 1 default animation, no scheduling needed (just loop forever)
            if (!this.randomGeneric && this.defaultAnimationUrls.length <= 1) return;

            const interval = (this.randomIntervalMin * 1000) + Math.random() * ((this.randomIntervalMax - this.randomIntervalMin) * 1000);
            console.log(`Next idle behavior in ${Math.round(interval / 1000)}s`);

            this.idleBehaviorTimeout = setTimeout(() => {
                if (this.randomGeneric) {
                    this.playRandomGenericAnimation();
                } else {
                    // RandomGeneric is FALSE, but we have multiple defaults, so switch defaults
                    this.switchDefaultAnimation();
                }
            }, interval);
        }

        async switchDefaultAnimation() {
            // Pick a NEW default animation (try to avoid current if possible, but random is okay)
            let nextAnim = this._getRandomDefaultAnimation();
            // Simple retry once to avoid same animation if we have > 1
            if (this.defaultAnimationUrls.length > 1 && (nextAnim === this.defaultAnimationUrl || this.animationUrl.includes(nextAnim))) {
                nextAnim = this._getRandomDefaultAnimation();
            }

            console.log(`Switching default animation to: ${nextAnim}`);
            // This will trigger _loadAnimation -> loop -> scheduleNextIdleBehavior again
            this.defaultAnimationUrl = nextAnim; // Update current tracker
            await this.loadAnimation(nextAnim);
        }

        async playRandomGenericAnimation() {
            if (!manifest || !manifest.VRMA) return;

            // Filter animations with "Generic" in the name (case-insensitive)
            const genericAnims = manifest.VRMA.filter(result =>
                result.toLowerCase().includes('generic')
            );

            if (genericAnims.length > 0) {
                const randomAnim = genericAnims[Math.floor(Math.random() * genericAnims.length)];
                console.log(`Playing random generic animation: ${randomAnim}`);
                // When this ends, _animate will call getRandomDefaultAnimation() -> loadAnimation -> scheduleNextIdleBehavior
                await this.loadAnimation(randomAnim);
            } else {
                // If no generic animations found, just schedule next check or switch default
                this.scheduleNextIdleBehavior();
            }
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

        _updateCamera(deltaTime) {
            if (!this.camera || !this.currentVrm || !this.currentLookAt) return;

            const hips = this.currentVrm.humanoid?.getRawBoneNode('hips');

            if (hips) {
                // reused vector
                hips.getWorldPosition(this.tempHipsPos);

                // 1. Grid Mask Update
                if (this.gridUniforms) {
                    this.gridUniforms.uMaskCenter.value.set(this.tempHipsPos.x, this.tempHipsPos.z);
                }

                // 2. Camera Follow Logic
                if (!this.initialHipsPos) {
                    this.initialHipsPos = this.tempHipsPos.clone();
                }

                const hipDelta = this.tempHipsPos.clone().sub(this.initialHipsPos);
                // MODIFIED: Use fixed offset for Y instead of following hip movement
                hipDelta.y = this.cameraYOffset;

                // Base Position (Default + User Offset)
                const basePos = new this.THREE.Vector3(
                    this.defaultCameraPosition.x + this.userCameraOffset.x,
                    this.defaultCameraPosition.y + this.userCameraOffset.y,
                    this.defaultCameraPosition.z + this.userCameraOffset.z
                );

                // Target Position = Base + HipDelta
                const targetPos = basePos.clone().add(hipDelta);

                // Interpolate
                // Handle instant snap for initialization (deltaTime === 0)
                const speed = this.cameraFollowSpeed;
                const lerpFactor = (deltaTime === 0) ? 1.0 : (1.0 - Math.exp(-speed * deltaTime));

                this.camera.position.lerp(targetPos, lerpFactor);

                // Look At Target
                // We want the camera to look at the "Logical Center" of the avatar.
                // But we ALSO want to smooth this so the avatar isn't pinned to the center if speed is low.
                const idealLookAt = new this.THREE.Vector3(
                    this.cameraLookAtTarget.x + this.userCameraOffset.x,
                    this.cameraLookAtTarget.y + this.userCameraOffset.y, // cameraYOffset is now handled in hipDelta
                    this.cameraLookAtTarget.z + this.userCameraOffset.z
                ).add(hipDelta);

                if (deltaTime === 0) {
                    this.currentLookAt.copy(idealLookAt);
                } else {
                    this.currentLookAt.lerp(idealLookAt, lerpFactor);
                }

                this.camera.lookAt(this.currentLookAt);
            }
        }
    }

    // Expose Global Object
    window.WebAvatar = {
        preload: async () => {
            await loadManifest();
        },
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
        getModels: async () => {
            if (!manifest) await loadManifest();
            return manifest && manifest.VRM ? manifest.VRM : [];
        },
        getAnimations: async () => {
            if (!manifest) await loadManifest();
            return manifest && manifest.VRMA ? manifest.VRMA : [];
        },
        disconnect: () => {
            if (widgetInstance) {
                widgetInstance.disconnect();
                widgetInstance = null;
            }
        }
    };

})();
