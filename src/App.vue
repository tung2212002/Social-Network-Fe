<template>
    <component :is="layout">
        <router-view :wsClient="client" />
        <LoadingComponent />
    </component>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, provide } from 'vue';
import { useRoute } from 'vue-router';
import { Client } from '@stomp/stompjs';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { LoadingComponent } from './components';

const route = useRoute();
const layout = computed(() => route.meta.layout || DefaultLayout);

const token = ref('eyJhbGciOiJIUzI1NiJ9.eyJmaW5nZXJwcmludGluZyI6IjIzMTIzMTI0MzEyNCIsInN1YiI6IjlAZ21haWwuY29tIiwiaWF0IjoxNzI0NDgzMjcwLCJleHAiOjE3MjQ1Njk2NzB9.aiQ67oHdy4VVMBvAOqs0lHYs774rIlx2CmahhMLauhU');

const wsConfig = ref({
    url: "ws://localhost:8080/ws",
    topic: "/topic/public",
    app: "/app/channel"
});

const client = ref(null);

const setConnectInfo = () => {
    wsConfig.value.app = `/channel/app/9`;
};

const connectWebSocket = () => {
    if (!token.value) {
        console.error('No token available for WebSocket connection');
        return;
    }

    const urlWithToken = `${wsConfig.value.url}?token=${encodeURIComponent(token.value)}`;

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
        }
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
    setConnectInfo();
    connectWebSocket();
});

onUnmounted(() => {
    if (client.value && client.value.active) {
        client.value.deactivate();
    }
});

// Provide the WebSocket client to all child components
provide('wsClient', client);
</script>