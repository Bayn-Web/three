<template>
    <canvas ref="mainCanvas" class="webgl"></canvas>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import { getThreeForm } from '../common/getThreeForm';
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
    const {
        scene,
        camera,
        renderer,
        controls
    } = getThreeForm(canvas)
    const sphereGeometry = new THREE.BufferGeometry()
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
    const count = 3000
    const positions = new Float32Array(count * 3) // 每个点由三个坐标值组成（x, y, z）
    const generatePointPosition = (i: number, positions: Float32Array) => {
        const x = (Math.random() - 0.5) * 6;
        const y = (Math.random() - 0.5) * 6;
        const z = (Math.random() - 0.5) * 6;
        const distance = Math.sqrt(x * x + y * y + z * z);
        if (distance <= 2.5 && distance >= 2.49) { //如果距离小于等于半径，则该点在圆内
            [positions[i * 3 + 0], positions[i * 3 + 1], positions[i * 3 + 2]] = [x, y, z]; //将该点的坐标存入points数组中
        } else {
            generatePointPosition(i, positions);
        }
    }
    for (let i = 0; i < count; i += 1) {
        generatePointPosition(i, positions);
    }
    sphereGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particles = new THREE.Points(sphereGeometry, pointMaterial)
    scene.add(particles)
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    }

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    listenResize(sizes, camera, renderer)

    const tick = () => {
        controls.update()
        pointMaterial.needsUpdate = true
        renderer.render(scene, camera)
        requestAnimationFrame(tick)
    }

    tick()
}
</script>

<style scoped></style>
