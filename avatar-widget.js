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

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.currentVrm = null;
        this.mixer = null;
        this.currentAction = null; // Track current action for cross-fading
        this.clock = new THREE.Clock();
        this.container = null;
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
        const light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(1.0, 1.0, 1.0).normalize();
        this.scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
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

        this.renderer.render(this.scene, this.camera);
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
}
