<script setup>
import { icons } from '@/assets';
import { blockUserService } from '@/services/friend/blockSerice';
import { deleteFriendService, getFriendListService, requestFriendService } from '@/services/friend/friendService';
import { useDialogStore, useFriendshipStore, usePostStore } from '@/stores';
import { computed } from 'vue';
import { reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

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
];

const friendStore = useFriendshipStore();
const dialogStore = useDialogStore();
const friends = computed(() => friendStore.getRequested);
const numberOfRequested = computed(() => friendStore.getNumberRequested);
const postStore = usePostStore();
const toast = useToast();

const state = reactive({
    isLoading: true,
    page: 0,
    size: 10,
    hasMore: true,
    firstLoad: true,
});

const loadMoreFriends = () => {
    state.isLoading = true;
    getFriendListService({
        page: state.page,
        size: state.size,
        status: 'REQUESTED',
    })
        .then((res) => {
            if (res.status === 200) {
                if (state.firstLoad) {
                    friendStore.setRequested(res.data.data.friendshipUsers);
                    state.firstLoad = false;
                } else {
                    friendStore.addListRequested(res.data.data.friendshipUsers);
                }
                state.page++;
                if (res.data.data.friendshipUsers.length < state.size) {
                    state.hasMore = false;
                }
                friendStore.setNumberRequested(res.data.data.friendQuantity);
            }
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            state.isLoading = false;
        });
};

const closeDialog = () => {
    dialogStore.hidden();
};

const handleBlockUser = () => {
    const body = {
        userId: dialogStore.data.user.userId,
    };
    blockUserService(body)
        .then((res) => {
            if (res.status === 200) {
                postStore.removePostByUserId(dialogStore.data.user.userId);
                friendStore.addBlock(dialogStore.data.user);
                friendStore.removeRequested(dialogStore.data.user.userId);
                friendStore.setNumberBlock(friendStore.getNumberBlock + 1);
                friendStore.setNumberRequested(numberOfRequested.value - 1);
                toast.success('Chặn người dùng thành công', { timeout: 3000 });
                dialogStore.hidden();
            } else {
                toast.error('Chặn người dùng thất bại', { timeout: 3000 });
            }
        })
        .catch((e) => {
            toast.error('Có lỗi xảy ra thử lại sau', { timeout: 3000 });
        });
};

const handleDeleteFriend = () => {
    const body = {
        userId: dialogStore.data.userId,
    };
    deleteFriendService(body)
        .then((res) => {
            if (res.status === 200) {
                friendStore.removeRequested(dialogStore.data.userId);
                friendStore.setNumberRequested(numberOfRequested.value - 1);

                dialogStore.hidden();
            } else {
                toast.error('Hủy kết bạn thất bại', { timeout: 3000 });
            }
        })
        .catch((e) => {
            toast.error('Có lỗi xảy ra thử lại sau...', { timeout: 3000 });
        });
};

const handleAddFriend = (user) => {
    const body = {
        userId: user.userId,
        state: 'CLOSE_FRIEND',
    };
    requestFriendService(body)
        .then((res) => {
            if (res.status === 200) {
                toast.success('Gửi yêu cầu kết bạn thành công', { timeout: 3000 });
                friendStore.updateFriend(user.userId);
                friendStore.setNumberRequested(numberOfRequested.value + 1);
            } else {
                toast.error('Gửi yêu cầu kết bạn thất bại', { timeout: 3000 });
            }
        })
        .catch((e) => {
            toast.error('Có lỗi xảy ra thử lại sau', { timeout: 3000 });
        });
};

const handleOpenDialogBlockUser = (user) => {
    dialogStore.show(
        'Chặn người dùng',
        `Bạn và ${user.lastName} ${user.firstName} sẽ không thể nhìn thấy nhau trên mạng xã hội`,
        'Chặn',
        'Thoát',
        handleBlockUser,
        closeDialog,
        { user },
    );
};

const handleOpenDialogDeleteFriend = (user) => {
    dialogStore.show(
        'Hủy kết bạn',
        `Bạn có chắc chắn muốn hủy kết bạn với ${user.lastName} ${user.firstName}`,
        'Hủy kết bạn',
        'Thoát',
        handleDeleteFriend,
        closeDialog,
        { userId: user.userId },
    );
};

const handleOpenDialogDeleteRequestedFriend = (user) => {
    dialogStore.show(
        'Hủy yêu cầu',
        `Bạn có chắc chắn muốn hủy yêu cầu kết bạn với ${user.lastName} ${user.firstName}`,
        'Hủy yêu cầu',
        'Thoát',
        handleDeleteFriend,
        closeDialog,
        { userId: user.userId },
    );
};

onMounted(() => {
    console.log('moutttt');
    console.log(state.firstLoad);
    loadMoreFriends();
});
</script>

<template>
    <div class="friend-list-container">
        <div v-if="numberOfRequested > 0">
            <span> Danh sách yêu cầu kết bạn </span>
            <span class="font-weight-bold"> {{ numberOfRequested }} người </span>
        </div>
        <div v-for="(friend, index) in friends" :key="friend.user.userId" class="friend-item">
            <img :src="friend.user.avatar || icons.defaultAvatar" alt="Avatar" class="friend-avatar" />
            <div class="friend-info">
                <h3>{{ friend.user.firstName }} {{ friend.user.lastName }}</h3>
                <p>{{ friend.user.userEmail }}</p>
                <p>Bạn chung: {{ friend.mutualFriendsQuantity }}</p>
                <p v-if="friend.status !== null">Status: {{ status.find((item) => item.value === friend.status).label }}</p>
            </div>
            <div class="friend-actions">
                <button v-if="friend.status === 'PENDING'" @click="handleOpenDialogDeleteRequestedFriend(friend.user)">Hủy yêu cầu</button>
                <button v-else-if="friend.status === null" @click="handleAddFriend(friend.user)">Kết bạn</button>
                <button v-else @click="handleOpenDialogDeleteFriend(friend.user)">Hủy kết bạn</button>
                <button v-if="friend.status !== 'BLOCK'" @click="handleOpenDialogBlockUser(friend.user)">Chặn</button>
            </div>
        </div>

        <div v-if="state.hasMore" class="load-more-container">
            <button @click="loadMoreFriends" :disabled="state.isLoading" class="load-more-button">Load More</button>
        </div>
    </div>
</template>

<style scoped>
.friend-list-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.friend-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.friend-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
}

.friend-info h3 {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
}

.friend-info p {
    margin: 5px 0;
    color: #666;
}

.friend-actions {
    display: flex;
    justify-content: end;
}

.friend-actions button {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.friend-actions button:hover {
    background-color: #0056b3;
}

.load-more-container {
    text-align: center;
    margin-top: 20px;
}

.load-more-button {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.load-more-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
