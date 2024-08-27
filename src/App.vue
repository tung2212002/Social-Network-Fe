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
        <EditPostComponent v-if="isOpenEditPost" />
        <CreatePostComponent />
        <ModalTagUserPostComponent v-if="openTagUser" />
    </component>
</template>

<script setup>
import { computed, onMounted, onUnmounted, provide, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { CreatePostComponent, LoadingComponent } from './components';
import { useTheme } from 'vuetify';
import ConfirmDialog from './components/ConfirmDialog.vue';
import { useCreaPostStore, useDialogStore, useLoadingStore, useModalStore, useUserStore } from './stores';
import EditPostComponent from './components/EditPostComponent.vue';
import ModalTagUserPostComponent from './components/ModalTagUserPostComponent.vue';
import { getLocalAccessToken, getLocalToken } from './utils/authStorage/authLocalStorage';
import { ref } from 'vue';
import { Client } from '@stomp/stompjs';
// import { ref } from 'vue';
// import { getLocalAccessToken } from './utils/authStorage/authLocalStorage';

const route = useRoute();
const layout = computed(() => route.meta.layout || DefaultLayout);
const dialogStore = useDialogStore();
const dialogInfo = computed(() => dialogStore.getDialogInfo);
const editPostStore = useCreaPostStore();
const isOpenEditPost = computed(() => editPostStore.getOpenUpdate);
const loadingStore = useModalStore();
console.log(loadingStore);
const openTagUser = computed(() => loadingStore.getModal);

useDocumentTitle('Cà khịa Social');

const theme = useTheme();

const wsConfig = ref({
    url: 'ws://localhost:8080/ws',
    topic: '/topic/public',
    app: '/app/channel',
});

const client = ref(null);
const token = getLocalAccessToken();
const userStorage = getLocalToken();

const setConnectInfo = () => {
    wsConfig.value.app = `/channel/app/${userStorage.user.userId}`;
};

const connectWebSocket = () => {
    if (!token) {
        console.error('No token available for WebSocket connection');
        return;
    }

    const urlWithToken = `${wsConfig.value.url}?token=${encodeURIComponent(token)}`;
    console.log('Connecting to WebSocket at:', urlWithToken);

    client.value = new Client({
        brokerURL: urlWithToken,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
            console.log('Connected to WebSocket');
            client.value.subscribe(wsConfig.value.topic, (message) => {
                console.log('Received message:', message.body);
                // Handle received message here
            });
            client.value.subscribe(wsConfig.value.app, (message) => {
                console.log('Received message:', message.body);
                // Handle received message here
            });
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        },
    });

    client.value.onWebSocketError = (error) => {
        console.error('WebSocket error', error);
    };

    client.value.onWebSocketClose = () => {
        console.log('WebSocket connection closed');
    };

    client.value.activate();
};

onMounted(() => {
    console.log('App mounted');
    setConnectInfo();
    console.log('Connecting to WebSocket');
    connectWebSocket();
});

onUnmounted(() => {
    if (client.value && client.value.active) {
        client.value.deactivate();
    }
});

// Provide the WebSocket client to all child components
provide('wsClient', client);
// onMounted(() => (theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'));
</script>

<style>
/* Your styles here */
</style>
