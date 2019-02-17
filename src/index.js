import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import * as orbitControls from 'orbit-controls';
import path from 'path';

import './style.css';

class Main {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20);
        this.renderer = new THREE.WebGLRenderer();
        this.clock = new THREE.Clock();
        this.mixer = null;
        this.target = new THREE.Vector3();
        this.controls = orbitControls({
            position: [0, 0, 3.7],
        })
    }

    setupCameraPosition() {
        this.camera.position.set(0, 0, 0);
        this.camera.lookAt(this.target);
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.gammaOutput = true;
        document.body.appendChild(this.renderer.domElement);
    }

    loadScene(pathToScene) {
        const loader = new GLTFLoader();

        loader.load(pathToScene, gltf => {
                gltf.scene.position.y = -3;
                gltf.scene.rotation.y = -0.05;
                this.scene.add(gltf.scene);
                this.mixer = new THREE.AnimationMixer(gltf.scene);
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
        this.controls.update();
        this.camera.position.fromArray(this.controls.position);
        this.camera.up.fromArray(this.controls.up);
        this.camera.lookAt(this.target.fromArray(this.controls.direction));
        this.renderer.render(this.scene, this.camera);
    }
}

const app = new Main();
app.setupCameraPosition();
app.setupRenderer();
app.loadScene('src/assets/scene.gltf');

