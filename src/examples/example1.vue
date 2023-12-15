<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { listenResize, generateColorCode } from '../common/utils';
import { onMounted, onBeforeUnmount } from 'vue';
let f = true
onMounted(() => {
  const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement
  const scene = new THREE.Scene()
  const sphereGeometry = new THREE.BufferGeometry()
  const sphereGeometry2 = new THREE.BufferGeometry()
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
  const pointMaterial2 = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color(generateColorCode())
      },
      eColor: {
        value: new THREE.Color(generateColorCode())
      },
      uSzie: {
        value: 0.01
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
        void main() {
            if (distance(gl_PointCoord, vec2(0.5, 0.5)) < 0.5){
              gl_FragColor = vec4(uColor, 1.0);
              return;
            }
            discard;
        }`
  })
  pointMaterial.needsUpdate = true
  const count = 2000
  const positions = new Float32Array(count * 3) // 每个点由三个坐标值组成（x, y, z）
  const positions2 = new Float32Array(count * 3) // 每个点由三个坐标值组成（x, y, z）
  const generatePointPosition = (i: number, positions: Float32Array) => {
    const x = (Math.random() - 0.5) * 5;
    const y = (Math.random() - 0.5) * 5;
    const z = (Math.random() - 0.5) * 5;
    const distance = Math.sqrt(x * x + y * y + z * z);
    if (distance <= 2.5) { //如果距离小于等于半径，则该点在圆内
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
  for (let i = 0; i < count; i += 1) {
    generatePointPosition(i, positions2);
  }
  sphereGeometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3))
  const particles2 = new THREE.Points(sphereGeometry2, pointMaterial2)
  scene.add(particles2)
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1)
  camera.position.set(0, 0, 0)

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
    camera.position.y += (Math.random() - 0.5) * 0.001
    camera.position.z += (Math.random()) * 0.01
    // Render
    renderer.render(scene, camera)
    f && requestAnimationFrame(tick)
  }

  tick()
})

onBeforeUnmount(() => {
  f = false
})
</script>

<template>
  <canvas id="mainCanvas" class="webgl"></canvas>
</template>

<style scoped></style>
