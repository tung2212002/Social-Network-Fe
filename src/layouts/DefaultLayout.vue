<template>
    <div>
        <HeaderComponent />
        <slot />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';

onMounted(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<style scoped></style>
