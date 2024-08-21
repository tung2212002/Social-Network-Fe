<template>
    <component :is="layout">
        <router-view />
        <LoadingComponent />
    </component>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { LoadingComponent } from './components';

const route = useRoute();
const layout = computed(() => route.meta.layout || DefaultLayout);
</script>

<style>
/* Your styles here */
</style>
