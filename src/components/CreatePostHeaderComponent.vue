<script setup>
import Close from 'vue-material-design-icons/Close.vue';
import ImageOutline from 'vue-material-design-icons/ImageOutline.vue';
import FileGifBox from 'vue-material-design-icons/FileGifBox.vue';
import Emoticon from 'vue-material-design-icons/Emoticon.vue';
import { icons } from '@/assets';
import { useUserStore } from '@/stores';
import { computed } from 'vue';

const userStore = useUserStore();
const user = computed(() => userStore.getUser);
</script>

<template>
    <div class="post-tweet">
        <form action="">
            <div class="form-group-1">
                <img :src="user?.avatar || icons.defaultAvatar" alt="avatar" />
                <input type="text" placeholder="What's happening?" />
            </div>
            <div class="form-group-2">
                <div class="post-icons">
                    <!-- <i class="far fa-image"></i>
                    <i class="far fa-file-image"></i>
                    <i class="fas fa-stream"></i>
                    <i class="far fa-smile"></i>
                    <i class="far fa-calendar-check"></i> -->
                    <ImageOutline />
                    <FileGifBox />
                    <Emoticon />
                </div>
                <button class="btn" type="submit">Tweet</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.post-tweet {
    background: #fff;
    border-bottom: 10px solid rgb(230, 236, 240);
}
.form-group-1 {
    display: flex;
    flex-flow: row;
    padding: 0.3rem 1rem;
}

.post-tweet img {
    display: inline-block;
    margin-right: 5px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    align-self: center;
}

.post-tweet input {
    width: 90%;
    height: 60px;
    padding: 0.5rem 1rem;
    border: none;
    font-size: 1.2rem;
    font-weight: 300;
}
.post-tweet input::placeholder {
    color: rgba(123, 124, 126, 0.719);
}
.post-tweet input:focus {
    outline: none;
}
.form-group-2 {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.8rem;
}

.post-icons {
    padding-left: 4rem;
    color: #1da1f2;
}
.post-icons i {
    padding-right: 10px;
    font-size: 1.4rem;
}
.post-icons i:hover {
    color: #1da0f2c2;
    cursor: pointer;
}
.form-group-2 .btn {
    border: none;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.7rem 1rem;
    background: #8ed0f9;
    color: #fff;
    border-radius: 25px;
    margin-right: 1rem;
}
.form-group-2 .btn:hover {
    background: #1da1f2;
    cursor: pointer;
}

.btn:focus {
    outline: none;
}
</style>
