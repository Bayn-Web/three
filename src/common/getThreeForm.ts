import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { listenResize, dbClkfullScreen } from './utils';


export const getThreeForm = (canvas: HTMLCanvasElement, noControl: boolean = false) => {
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas as HTMLCanvasElement,
        antialias: true,
        alpha: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(new THREE.Color('#000000'), 1);

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1)
    camera.position.set(0, 0, 3)
    scene.add(camera)
    let controls = undefined;
    if (!noControl) {
        controls = new OrbitControls(camera, canvas as HTMLElement)
        controls.enableDamping = true
    }
    listenResize(sizes, camera, renderer)
    dbClkfullScreen(canvas)
    return {
        scene,
        camera,
        renderer,
        controls
    }
}   