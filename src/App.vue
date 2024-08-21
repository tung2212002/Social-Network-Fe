<template>
    <component :is="layout">
        <router-view />
        <LoadingComponent />
    </component>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { LoadingComponent } from './components';

const route = useRoute();
const layout = computed(() => route.meta.layout || DefaultLayout);

import { useTheme } from 'vuetify';

const theme = useTheme();

// onMounted(() => (theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'));
</script>

<style>
/* Your styles here */
</style>
