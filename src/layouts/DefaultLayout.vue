<template>
    <div class="layout">
        <SideBarComponent />
        <slot class="content" />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { SideBarComponent } from '@/components';

onMounted(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<style scoped>
.layout {
    width: 1280px;
    display: flex;
    flex-direction: row;
}

.content {
    flex: 1;
    overflow-y: auto;
    height: 100vh;
}
</style>
