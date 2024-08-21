<script setup>
import { icons } from '@/assets';
import route from '@/constants/route';
import { logoutService } from '@/services/user/authService';
import { useUserStore } from '@/stores';
import { removeAll } from '@/utils/authStorage/authLocalStorage';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const user = computed(() => userStore.user);
const isMenuOpen = ref(false);

const router = useRouter();
</script>

<template>
    <div class="container">
        <div class="position-relative">
            <button class="btn-info">
                <v-btn icon>
                    <v-avatar color="brown" size="large">
                        <span class="text-h5">{{ user?.avatar || icons.defaultAvatar }}</span>
                    </v-avatar>
                </v-btn>
                <v-card-text class="info">
                    <h3 class="full-name" @mouseenter="isMenuOpen = true" @mouseleave="isMenuOpen = false">{{ user?.lastName }} {{ user?.firstName }}</h3>
                    <p class="email">{{ user?.userEmail }}</p>
                </v-card-text>
                <button class="btn-friend">
                    <span> Kết bạn </span>
                </button>
            </button>
        </div>
    </div>
</template>

<style scoped>
.container {
    background-color: black;
}

.position-relative {
    position: relative;
}
.btn-info {
    width: 100%;
    color: azure;
    display: flex;
    align-items: center;
    border-radius: 40px;
    padding: 0 8px;

    .info {
        padding: 4px 10px;
    }
}

.full-name {
    font-size: 15px;
    line-height: 20px;
    font-weight: 700;
    text-align: left;
    &:hover {
        text-decoration: underline;
    }
}

.email {
    font-size: 15px;
    margin: 0;
    font-weight: 300;
    color: rgb(153, 152, 152);
    text-align: left;
}

.custom-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    z-index: 1000;
}

.btn-friend {
    font-size: 16px;
    font-weight: 600;
    background-color: #969696;
    color: black;
    width: 100%;
    padding: 4px 16px;
    border-radius: 16px;
    position: absolute;
    right: 0;
    max-width: 100px;
    &:hover {
        background-color: #7c7c7c;
    }
}
</style>
