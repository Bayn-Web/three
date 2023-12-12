<template>
    <canvas ref="mainCanvas" class="webgl"></canvas>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import {
    ref, onMounted
} from 'vue';
import { getThreeForm } from '../common/getThreeForm';
import shader from '../glsl/sea.glsl?raw';
const mainCanvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
    const {
        scene,
        camera,
        renderer
    } = getThreeForm(mainCanvas.value as HTMLCanvasElement, true);
    const ambLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambLight);
    var imouse = new THREE.Vector2();
    const uniforms = {
        resolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        },
        iTime: {
            type: "f",
            value: 1.0
        },
        iResolution: {
            type: "v3",
            value: new THREE.Vector3(mainCanvas.value!.width, mainCanvas.value!.height, 1)
        },
        iMouse: {
            type: "v2",
            value: imouse
        }
    };
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: shader
    });
    camera.position.set(0, 0, 0.5)
    var geometry = new THREE.PlaneGeometry(2, 1);
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    let f = false;
    const tick = (time: number) => {
        time *= 0.001;
        uniforms.iTime.value = time;
        // slow it down
        // make gpu render in time
        f = !f
        if (f) {
            renderer.render(scene, camera)
        }
        requestAnimationFrame(tick)
    }
    tick(100000)
})
</script>

<style scoped></style>