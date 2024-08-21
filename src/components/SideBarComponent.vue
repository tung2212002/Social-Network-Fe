<script setup>
import InfoButtonComponent from './InfoButtonComponent.vue';
import MenuItem from './MenuItem.vue';
</script>

<template>
    <div class="lg:w-3/12 w-[60px] h-[100vh] max-w-[250px] side-bar">
        <div class="p-2 px-3 mb-4">
            <Twitter fillColor="#FFFFFF" :size="37" />
        </div>

        <MenuItem iconString="Home" />
        <MenuItem iconString="Explore" />
        <MenuItem iconString="Notifications" />
        <MenuItem iconString="Messages" />
        <MenuItem iconString="Profile" />

        <button class="mt-8 ml-2 text-white font-extrabold text-[22px] bg-[#1C9CEF] p-3 px-3 rounded-full cursor-pointer button">
            <span class="lg:block hidden post">Post</span>
            <span class="block lg:hidden"><Feather /></span>
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
    display: inline;
    list-style: none;
    margin: 0px;
    padding: 0px;
    position: relative;
    text-align: start;
    white-space: pre-wrap;
    word-wrap: break-word;
    text-overflow: unset;
    color: rgb(255, 255, 255);
    line-height: 20px;
    word-wrap: break-word;
    text-align: center;
    min-width: 0px;
    font-weight: 700;
    font-size: 15px;
    align-items: center;
}

.info {
    position: absolute;
    bottom: 0;
}
</style>
