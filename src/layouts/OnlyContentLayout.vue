<template>
    <div>
        <slot />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<style scoped></style>
