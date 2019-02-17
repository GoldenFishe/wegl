import {Scene, WebGLRenderer, Clock, PerspectiveCamera, AnimationMixer} from 'three';
import GLTFLoader from 'three-gltf-loader';

import './style.css';

class Main {
    constructor() {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10);
        this.renderer = new WebGLRenderer();
        this.clock = new Clock();
        this.mixer = null;
    }

    setupCameraPosition() {
        this.camera.position.z = 3;
        this.camera.position.y = 4;
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    loadScene(pathToScene) {
        const loader = new GLTFLoader();

        loader.load(pathToScene, gltf => {
                this.scene.add(gltf.scene);
                this.mixer = new AnimationMixer(gltf.scene);
                this.mixer.clipAction(gltf.animations[0]).play();

                this.animate();

                gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // THREE.Scene
                gltf.scenes; // Array<THREE.Scene>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object
            },
            xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
            error => console.error(`An error happened: ${error}`)
        );
    }

    animate() {
        window.requestAnimationFrame(() => this.animate());
        const delta = this.clock.getDelta();
        if (this.mixer != null) {
            this.mixer.update(delta);
        }
        this.renderer.render(this.scene, this.camera);
    }
}

const app = new Main();
app.setupCameraPosition();
app.setupRenderer();
app.loadScene('src/assets/scene.gltf');

