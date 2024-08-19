<template>
    <div :class="wrapperClass">
        <slot />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

// Xử lý cuộn trang
onMounted(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<style scoped>
/* Bạn có thể import SCSS hoặc CSS trực tiếp từ file này nếu cần */
</style>
