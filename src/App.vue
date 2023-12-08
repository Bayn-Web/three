<template>
  <div>
    <router-link v-for="item in filenames" :key="item.path" :to="item.path">{{ item.path }}</router-link>
  </div>
  <RouterView :key="route.path" />
</template>
<script lang="ts" setup>
import { filenames } from "./router"
import { useRoute } from "vue-router";
const route = useRoute()
</script>