<script setup>
// Importing necessary Vue functions
import { icons } from '@/assets';
import { useModalStore } from '@/stores';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const modalStore = useModalStore();
const tagUsers = ref(modalStore.getTagUser);
const router = useRouter();

const close = () => {
    modalStore.hidden();
};

const handleNavigateToProfile = (userId) => {
    modalStore.hidden();
    router.push(`/profile/${userId}`);
};
</script>

<template>
    <div id="OverlaySection" class="fixed top-0 left-0 w-full h-screen md:bg-blue-900 md:bg-opacity-30 md:p-3 z-155550 bg-opacity-70">
        <div class="md:max-w-2xl md:mx-auto md:mt-10 md:rounded-xl bg-black bg-opacity-90 p-4 content relative">
            <div class="text-white font-bold text-lg title border-b-2 border-white pb-4">Mọi người</div>
            <div class="cursor-pointer text-white close" @click="close">X</div>
            <div
                v-for="tagUser in tagUsers"
                :key="tagUser.userId"
                class="flex items-center justify-start w-fit-content p-2 rounded-full tag"
                @click="handleNavigateToProfile(tagUser.userId)"
            >
                <div class="avatar w-10 h-10 rounded-full">
                    <img :src="tagUser.avatar || icons.defaultAvatar" alt="Avatar" class="w-full h-full rounded-full" />
                </div>
                <div class="name p-2 text-white">{{ tagUser.lastName }} {{ tagUser.firstName }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.title {
    text-align: center;
}

.content {
    width: fit-content;
}

.tag {
    min-width: 200px;
    text-decoration: none;

    &:hover {
        cursor: pointer;
        background-color: rgb(158, 134, 134);
    }
}

.close {
    font-size: 20px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-left: auto;
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        color: rgb(107, 79, 79);
        background-color: white;
    }
}

.name {
    font-size: 15px;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}
</style>
