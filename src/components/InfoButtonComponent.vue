<script setup>
import { icons } from '@/assets';
import route from '@/constants/route';
import { logoutService } from '@/services/user/authService';
import { useUserStore } from '@/stores';
import { removeAll } from '@/utils/authStorage/authLocalStorage';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const user = computed(() => userStore.user);
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
    <v-container style="height: 300px" fluid>
        <v-row justify="center">
            <v-menu min-width="200px" rounded activator="parent" location="bottom">
                <template v-slot:activator="{ props }">
                    <button v-bind="props" class="btn-info">
                        <v-btn icon>
                            <v-avatar color="brown" size="large">
                                <span class="text-h5">{{ user?.avatar || icons.defaultAvatar }}</span>
                            </v-avatar>
                        </v-btn>
                        <v-card-text class="info">
                            <h3 class="full-name">{{ user?.lastName }} {{ user?.firstName }}</h3>
                            <p class="email">{{ user?.userEmail }}</p>
                        </v-card-text>
                        <i class="ri-more-fill" style="font-size: 24px"></i>
                    </button>
                </template>

                <v-card>
                    <v-btn class="logout" @click="logout">Logout {{ user?.userEmail }} </v-btn>
                </v-card>
            </v-menu>
        </v-row>
    </v-container>
</template>

<style scoped>
.btn-info {
    width: 100%;
    color: azure;
    display: flex;
    align-items: center;
    border-radius: 40px;
    padding: 0 8px;
    &:hover {
        background-color: rgb(39, 33, 33);
    }

    .info {
        margin-top: 10px;
        padding: 4px 10px;
    }
}

.full-name {
    font-size: 15px;
    line-height: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
}

.email {
    font-size: 15px;
    margin: 0;
    font-weight: 300;
    color: rgb(153, 152, 152);
}

.logout {
    text-transform: none;
}
</style>
