<template>
    <canvas ref="mainCanvas" class="webgl"></canvas>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
    ref,
    onMounted
} from 'vue';
import { generateColorCode, listenResize, dbClkfullScreen } from '../common/utils';
const mainCanvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
    starsSea(mainCanvas.value as HTMLCanvasElement)
    dbClkfullScreen(mainCanvas.value as HTMLCanvasElement)
})
const starsSea = (canvas: HTMLCanvasElement) => {
    const scene = new THREE.Scene()
    const pointMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uColor: {
                value: new THREE.Color(generateColorCode())
            },
            eColor: {
                value: new THREE.Color(generateColorCode())
            },
            uSzie: {
                value: 0.1
            }
        },
        opacity: 0.4,
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
          uniform vec3 eColor;
          void main() {
              if (distance(gl_PointCoord, vec2(0.5, 0.5)) < 0.3)
                discard;
              if (distance(gl_PointCoord, vec2(0.5, 0.5)) < 0.4){
                gl_FragColor = vec4(uColor, 1.0);
                return;
              }
              if (distance(gl_PointCoord, vec2(0.5, 0.5)) < 0.5){
                gl_FragColor = vec4(eColor, 1.0);
                return;
              }
              discard;
          }`
    })
    const count = 2000
    const originPositions = new Float32Array(3)
    originPositions[0] = 0
    originPositions[1] = 0
    originPositions[2] = 0
    const positions = new Float32Array(3) // 每个点由三个坐标值组成（x, y, z）
    const generatePointPosition = (positions: Float32Array, Tdistance: number, doHalf: boolean = false) => {
        const x = (Math.random() - 0.5) * Tdistance * 2;
        const y = (Math.random() - 0.5) * Tdistance * 2;
        const z = (Math.random() - 0.5) * Tdistance * 2;
        const distance = Math.sqrt(x * x + y * y + z * z);
        if (distance <= Tdistance && distance >= Tdistance - 0.1) { //如果距离小于等于半径，则该点在圆内
            if (doHalf) {
                if (y < 0) {
                    generatePointPosition(positions, Tdistance, doHalf);
                    return;
                }
            }
            [positions[0], positions[1], positions[2]] = [x, y, z]; //将该点的坐标存入points数组中
        } else {
            generatePointPosition(positions, Tdistance, doHalf);
        }
    }
    for (let i = 0; i < count; i++) {
        generatePointPosition(positions, 3);
        const sphereGeometry = new THREE.BufferGeometry()
        sphereGeometry.setAttribute('position', new THREE.BufferAttribute(originPositions, 3))
        const particles = new THREE.Points(sphereGeometry, pointMaterial)
        particles.position.set(positions[0], positions[1], positions[2])
        scene.add(particles)
        let tween = new TWEEN.Tween(particles.position)
        generatePointPosition(positions, 2, true);
        tween.to({
            x: positions[0],
            y: positions[1],
            z: positions[2]
        }, Math.random() * 10000)
        tween.easing(TWEEN.Easing.Quadratic.Out)
        tween.start();
    }
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    }

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1)
    camera.position.set(0, 0, 4)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.zoomSpeed = 0.3

    const renderer = new THREE.WebGLRenderer({
        canvas,
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    listenResize(sizes, camera, renderer)
    const tick = () => {
        controls.update()
        TWEEN.update();
        pointMaterial.needsUpdate = true
        renderer.render(scene, camera)
        requestAnimationFrame(tick)
    }

    tick()
}
</script>

<style scoped></style>
