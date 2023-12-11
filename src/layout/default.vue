<template>
    <template v-for="item in filenames">
        <button @click="switchComponent(item.path)">{{ item.path }}</button>
    </template>
    <component :is="value" />
</template>

<script setup lang="ts">
import { shallowRef } from "vue"
import { filenames } from "../router"
const value = shallowRef()
const switchComponent = async (path: string) => {
    value.value = (await import(`../examples/${path}.vue`)).default
}
</script>

<style scoped></style>