<template>
    <component :is="layout">
        <router-view />
        <LoadingComponent />
        <ConfirmDialog
            v-if="dialogInfo.dialog"
            :agreeFunc="dialogInfo.agreeFunc"
            :disagreeFunc="dialogInfo.disagreeFunc"
            :title="dialogInfo.title"
            :content="dialogInfo.content"
            :agreeText="dialogInfo.agreeText"
            :disagreeText="dialogInfo.disagreeText"
        ></ConfirmDialog>
    </component>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { LoadingComponent } from './components';
import { useTheme } from 'vuetify';
import ConfirmDialog from './components/ConfirmDialog.vue';
import { useDialogStore } from './stores';

const route = useRoute();
const layout = computed(() => route.meta.layout || DefaultLayout);
const dialogStore = useDialogStore();
const dialogInfo = computed(() => dialogStore.getDialogInfo);

useDocumentTitle('Cà khịa Social');

const theme = useTheme();

// onMounted(() => (theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'));
</script>

<style>
/* Your styles here */
</style>
