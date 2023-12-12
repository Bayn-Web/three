<template>
    <canvas ref="mainCanvas" class="webgl"></canvas>
</template>

<script lang="ts" setup>
import {
    onMounted,
    ref
} from 'vue';
import { getThreeForm } from '../common/getThreeForm';
import * as THREE from 'three'

const mainCanvas = ref<HTMLCanvasElement>();
onMounted(() => {
    const {
        scene,
        camera,
        renderer,
        controls
    } = getThreeForm(mainCanvas.value as HTMLCanvasElement);
    const ambLight = new THREE.AmbientLight(0x000000, 1)
    const dirLight = new THREE.SpotLight(0xffffff, 1)

    dirLight.position.set(0, 3, 2)
    dirLight.target.position.set(0, 0, 0)
    dirLight.shadow.mapSize.set(1024, 1024)
    dirLight.castShadow = true

    const lights = [dirLight, ambLight]
    scene.add(...lights);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0)
    mesh.castShadow = true
    scene.add(mesh);
    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    planeGeometry.rotateX(-Math.PI / 2);
    // 使平面就接收物体投掷过来的阴影
    plane.receiveShadow = true;
    plane.position.set(0, -0.6, 0)
    scene.add(plane);
    renderer.shadowMap.enabled = true;
    const tick = () => {
        controls!.update()
        renderer.render(scene, camera)
        requestAnimationFrame(tick)
    }

    tick()
})
</script>

<style scoped></style>