<script setup>
import { icons } from '@/assets';
import route from '@/constants/route';
import { logoutService } from '@/services/user/authService';
import { useUserStore } from '@/stores';
import { removeAll } from '@/utils/authStorage/authLocalStorage';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import SuggestFriendDetailComponent from './SuggestFriendDetailComponent.vue';
import { deleteFriendService, requestFriendService } from '@/services/friend/friendService';

const props = defineProps({
    friend: Object,
});

const friend = ref(props.friend);
const isMenuOpen = ref(false);

const handleRequestFriend = () => {
    const body = {
        userReceiveId: friend.value.user.userId,
        status: 'CLOSE_FRIEND',
    };

    requestFriendService(body)
        .then((res) => {
            if (res.status === 200) {
                friend.value.status = 'PENDING';
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

const unRequestFriend = () => {
    const body = {
        userId: friend.value.user.userId,
        status: 'CLOSE_FRIEND',
    };

    deleteFriendService(body)
        .then((res) => {
            if (res.status === 200) {
                friend.value.status = null;
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
</script>

<template>
    <div class="container">
        <div class="position-relative">
            <button class="btn-info">
                <v-btn icon>
                    <v-avatar size="large">
                        <v-img alt="Avatar" :src="friend?.user?.avatar || icons.defaultAvatar"> </v-img>
                    </v-avatar>
                </v-btn>
                <v-card-text class="info">
                    <div class="wrapper" @mouseenter="isMenuOpen = true" @mouseleave="isMenuOpen = false">
                        <h3 class="full-name">{{ friend?.user?.lastName }} {{ friend?.user?.firstName }}</h3>
                        <div v-show="isMenuOpen" class="custom-menu">
                            <SuggestFriendDetailComponent :friend="friend" />
                        </div>
                    </div>
                    <p class="email">{{ friend?.user?.userEmail }}</p>
                </v-card-text>
                <button class="btn-friend" @click="unRequestFriend" v-if="friend.status === 'PENDING'">
                    <span v-if="friend.status === 'PENDING'">Hủy yêu cầu</span>
                </button>
                <button class="btn-friend" @click="handleRequestFriend" v-if="friend.status === null">
                    <span>Kết bạn</span>
                </button>
            </button>
        </div>
    </div>
</template>

<style scoped>
.container {
    z-index: 0;
}

.position-relative {
}
.btn-info {
    width: 100%;
    color: azure;
    display: flex;
    align-items: center;
    border-radius: 40px;
    padding: 0 8px;
    max-width: 70%;

    .info {
        padding: 4px 10px;
    }
}
.wrapper {
    position: relative;
}
.full-name {
    font-size: 15px;
    line-height: 20px;
    font-weight: 700;
    text-align: left;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;

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
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}

.custom-menu {
    position: absolute;
    bottom: -50%;
    right: -100%;
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
