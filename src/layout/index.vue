<template>
    <template v-for="item in filenames">
        <button>
            <router-link :to="item.path">{{ item.path }}</router-link>
        </button>
    </template>
    <router-view></router-view>
</template>

<script setup lang="ts">
import { filenames } from "../router"

</script>

<style scoped></style>