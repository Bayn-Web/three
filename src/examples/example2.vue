<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted } from 'vue';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const radom = () => {
    return Math.floor(Math.random() * 255)
}
onMounted(() => {
    const canvas = document.querySelector('#mainCanvas')
    // Scene
    const scene = new THREE.Scene()
    const positions = [{
        x: 0,
        y: 0,
        z: 0
    }];
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas as HTMLCanvasElement,
        antialias: true,
        alpha: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(new THREE.Color('#00ff00'), 1);
    const attrPositions: number[] = [];

    positions.forEach((p) => {
        attrPositions.push(p.x, p.y, p.z);
    })

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(attrPositions, 3));

    const shader = new THREE.ShaderMaterial({
        uniforms: {
            uColor: {
                value: new THREE.Color('#FFFF00')
            },
            uSzie: {
                value: 200
            }
        },
        vertexShader: `
        uniform float uSzie;
        void main() {
            // 顶点着色器计算后的Position
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition; 
            // 大小
            gl_PointSize = uSzie * 300.0 / (-mvPosition.z);
        }`,
        fragmentShader: `
        uniform vec3 uColor;
        void main() {
            if (distance(gl_PointCoord, vec2(0.5, 0.5)) > 0.5) discard;
            gl_FragColor = vec4(uColor, 1.0);
        }`
    });

    const point = new THREE.Points(geometry, shader);
    scene.add(point);
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 10000)
    camera.position.set(0, 0, 1200)
    scene.add(camera)
    const controls = new OrbitControls(camera, canvas as HTMLElement)
    const color = `rgb(${radom()}, ${radom()}, ${radom()})`;
    shader.uniforms.uColor.value.setStyle(color);

    const tick = () => {
        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(tick)
    }
    tick()
})
</script>

<template>
    <canvas id="mainCanvas" class="webgl"></canvas>
</template>

<style scoped></style>
