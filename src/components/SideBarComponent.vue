<script setup>
import { useCreaPostStore } from '@/stores';
import InfoButtonComponent from './InfoButtonComponent.vue';
import MenuItem from './MenuItem.vue';

const store = useCreaPostStore();

const handleShow = () => {
    store.show();
};

const menuItems = [
    { iconString: 'Home', route: '/' },
    { iconString: 'Explore', route: '/explore' },
    { iconString: 'Notifications', route: '/notifications' },
    { iconString: 'Messages', route: '/messages' },
    { iconString: 'Profile', route: '/profile' },
    { iconString: 'Friends', route: '/friends' },
];
</script>

<template>
    <div class="lg:w-3/12 w-[60px] h-[100vh] max-w-[250px] side-bar">
        <div class="p-2 px-3 mb-4">
            <Twitter fillColor="#FFFFFF" :size="37" />
        </div>
        <template v-for="item in menuItems" :key="item.route">
            <MenuItem :iconString="item.iconString" :route="item.route" />
        </template>
        <button class="mt-8 ml-2 text-white font-extrabold text-[22px] bg-[#1C9CEF] p-3 px-3 rounded-full cursor-pointer button" @click="handleShow">
            <span class="lg:block hidden post">Tạo bài</span>
        </button>
        <div class="info">
            <InfoButtonComponent />
        </div>
    </div>
</template>

<style scoped>
.side-bar {
    overflow: auto;
    position: relative;
}

.button {
    min-width: 220px;
    padding: 12px !important;

    &:hover {
        background-color: rgb(114, 151, 175);
    }
}

.post {
    background-color: rgba(0, 0, 0, 0);
    border: 0 solid black;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    list-style: none;
    margin: 0px;
    padding: 4px 0px;
    position: relative;
    text-align: start;
    white-space: pre-wrap;
    word-wrap: break-word;
    text-overflow: unset;
    color: rgb(255, 255, 255);
    line-height: 20px;
    word-wrap: break-word;
    min-width: 0px;
    font-weight: 700;
    font-size: 17px;
}

.info {
    position: absolute;
    bottom: 0;
    width: 100%;
}
</style>
