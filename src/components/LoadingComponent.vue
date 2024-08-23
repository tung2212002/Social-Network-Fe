<script setup>
import { computed } from 'vue';
import { useLoadingStore } from '@/stores';

const loadingStore = useLoadingStore();
const loadingLocal = computed(() => loadingStore.getLoading);
</script>
<template>
    <div class="pa-4 text-center">
        <v-dialog v-model="loadingLocal" max-width="240" persistent>
            <v-list class="py-2" color="primary" elevation="12" rounded="lg">
                <v-list-item>
                    <div class="container-content">
                        <div class="logo">
                            <i class="ri-twitter-x-fill"></i>
                        </div>
                        <span class="text"> Đợi chút... </span>
                    </div>
                    <template v-slot:append>
                        <v-progress-circular color="primary" indeterminate="disable-shrink" size="30" width="2"></v-progress-circular>
                    </template>
                </v-list-item>
            </v-list>
        </v-dialog>
    </div>
</template>

<style scoped>
.container-content {
    display: flex;
    align-items: center;
    .logo {
        display: flex;
        align-items: center;
        margin: 0 20px;
    }

    .text {
        font-size: 1.2em;
        font-weight: 500;
    }
}
</style>
