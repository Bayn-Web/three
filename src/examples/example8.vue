<template>
  <canvas ref="mainCanvas" class="webgl"></canvas>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getThreeForm } from "../common/getThreeForm";
import Stats from "three/examples/jsm/libs/stats.module.js";
import shader from "../glsl/rain.glsl?raw";
let stats: any = new Stats();
const mainCanvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
  // 设置监视器面板，传入面板id（0: fps, 1: ms, 2: mb）
  stats.setMode(0);

  // 设置监视器位置
  stats.domElement.style.position = "absolute";
  stats.domElement.style.right = "10px";
  stats.domElement.style.left = "";
  stats.domElement.style.top = "0px";

  // 将监视器添加到页面中
  document.body.appendChild(stats.domElement);
  const { scene, camera, renderer } = getThreeForm(
    mainCanvas.value as HTMLCanvasElement,
    true
  );
  const ambLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambLight);
  const textureLoader = new THREE.TextureLoader();

  // 加载纹理图像
  const texture = textureLoader.load("/bk.png", () => {
    // 纹理加载完成后，更新材质
    material.needsUpdate = true;
  });
  var imouse = new THREE.Vector2();
  const uniforms = {
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    iChannel0: {
      value: texture,
    },
    iTime: {
      type: "f",
      value: 1.0,
    },
    iResolution: {
      type: "v3",
      value: new THREE.Vector3(mainCanvas.value!.width, mainCanvas.value!.height, 1),
    },
    iMouse: {
      type: "v2",
      value: imouse,
    },
  };
  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: shader,
  });
  camera.position.set(0, 0, 0.5);
  var geometry = new THREE.PlaneGeometry(2, 1);
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  let flag = false;
  const tick = (time: number) => {
    stats.update();
    time *= 0.001;
    uniforms.iTime.value = time;
    // slow it down
    // make gpu render in time
    flag = !flag;
    if (flag) {
      renderer.render(scene, camera);
      requestAnimationFrame(() => undefined);
    }
    f && requestAnimationFrame(tick);
  };
  tick(100000);
});

let f = true;

onBeforeUnmount(() => {
  f = false;
  stats.domElement.remove();
});
</script>

<style scoped>
.bk-img {
  z-index: -1;
  width: 100vw;
  height: 100vh;
  object-fit: contain;
}
</style>
