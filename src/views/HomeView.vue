<script setup>
import route from '@/constants/route';
import { logoutService } from '@/services/user/authService';
import { useUserStore } from '@/stores';
import { removeAll } from '@/utils/authStorage/authLocalStorage';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const user = userStore.user;
console.log(user);
const router = useRouter();

const logout = () => {
    logoutService();
    userStore.clearUser();
    removeAll();
    router.push(route.LOGINPAGE);
};
</script>

<template>
    <div class="home">
        <h1>This is an home page for {{ user.lastName }} {{ user.lastName }}</h1>
        <button type="button" @click="logout">test logout</button>
    </div>
</template>

<style>
@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>
