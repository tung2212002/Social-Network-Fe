<script setup>
import { icons } from '@/assets';
import { deleteFriendService, requestFriendService } from '@/services/friend/friendService';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    friend: Object,
});
// const user = props.friend;
const user = ref(props.friend);
const isMenuOpen = ref(false);

const status = [
    {
        value: 'REQUESTED',
        label: 'Đã gửi yêu cầu',
    },
    {
        value: 'PENDING',
        label: 'Chờ xác nhận',
    },
    {
        value: 'CLOSE_FRIEND',
        label: 'Bạn bè',
    },
    {
        value: 'SIBLING',
        label: 'Anh chị em',
    },
    {
        value: 'PARENT',
        label: 'Bố mẹ',
    },
    {
        value: 'OTHER',
        label: 'Khác',
    },
    {
        value: 'BLOCK',
        label: 'Chặn',
    },
    {
        value: null,
        label: '',
    },
];

console.log(user.value);

const router = useRouter();

const handleRequestFriend = () => {
    const body = {
        userReceiveId: user.value.user.userId,
        status: 'CLOSE_FRIEND',
    };

    requestFriendService(body)
        .then((res) => {
            if (res.status === 200) {
                user.value.status = 'PENDING';
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

const unRequestFriend = () => {
    const body = {
        userId: user.value.user.userId,
        status: 'CLOSE_FRIEND',
    };

    deleteFriendService(body)
        .then((res) => {
            if (res.status === 200) {
                user.value.status = null;
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
                <v-card-text class="info">
                    <v-avatar size="80px">
                        <v-img alt="Avatar" :src="friend?.user?.avatar || icons.defaultAvatar"> </v-img>
                    </v-avatar>
                    <RouterLink :to="`/profile/${friend.user?.userId}`" class="full-name" @mouseenter="isMenuOpen = true" @mouseleave="isMenuOpen = false"
                        >{{ friend.user?.lastName }} {{ friend.user?.firstName }}</RouterLink
                    >
                    <p class="email">{{ friend.user?.userEmail }}</p>
                    <p v-show="friend.mutualFriendsQuantity > 0" class="email">Có {{ user.mutualFriendsQuantity }} bạn chung</p>
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
    background-color: black;
}
.info {
    display: flex;
    flex-direction: column;
}
.position-relative {
    position: relative;
}
.btn-info {
    width: 300px;
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
        background-color: black;
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
    padding: 4px 20px;
    border-radius: 16px;
    position: absolute;
    right: 0;
    max-width: 100px;
    position: absolute;
    top: 0;
    right: 0;
    &:hover {
        background-color: #7c7c7c;
    }
}
</style>
