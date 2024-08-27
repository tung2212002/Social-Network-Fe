<script setup>
import { icons } from '@/assets';
import { blockUserService } from '@/services/friend/blockSerice';
import { acceptFriendService, deleteFriendService, getFriendListService, requestFriendService } from '@/services/friend/friendService';
import { useDialogStore, useFriendshipStore, usePostStore } from '@/stores';
import { computed } from 'vue';
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
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
    {
        value: null,
        label: '',
    },
];

const friendStore = useFriendshipStore();
const dialogStore = useDialogStore();
const friends = computed(() => friendStore.getPendings);
const numberPendings = computed(() => friendStore.getNumberPending);
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
        status: 'PENDING',
    })
        .then((res) => {
            if (res.status === 200) {
                if (state.firstLoad) {
                    friendStore.setPendings(res.data.data.friendshipUsers);
                    state.firstLoad = false;
                } else {
                    friendStore.addListPending(res.data.data.friendshipUsers);
                }
                state.page++;
                if (res.data.data.friendshipUsers.length < state.size) {
                    state.hasMore = false;
                }
                friendStore.setNumberPending(res.data.data.friendQuantity);
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
                friendStore.addBlock(dialogStore.data);
                friendStore.removePending(dialogStore.data.user.userId);
                friendStore.setNumberPending(friendStore.getNumberPending - 1);
                friendStore.setNumberBlock(friendStore.getNumberBlock + 1);
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
                postStore.removePostByUserId(dialogStore.data.userId);
                dialogStore.hidden();
                friendStore.removeFriend(dialogStore.data.userId);
                friendStore.removePending(dialogStore.data.userId);
                friendStore.setNumberFriend(friendStore.getNumberFriend - 1);
            } else {
                toast.error('Hủy kết bạn thất bại', { timeout: 3000 });
            }
        })
        .catch((e) => {
            console.error(e);
            toast.error('Có lỗi xảy ra thử lại sau', { timeout: 3000 });
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
                friendStore.setNumberRequested(friendStore.getNumberRequested + 1);
            } else {
                toast.error('Gửi yêu cầu kết bạn thất bại', { timeout: 3000 });
            }
        })
        .catch((e) => {
            toast.error('Có lỗi xảy ra thử lại sau', { timeout: 3000 });
        });
};

const handleAcceptFriend = (user) => {
    const body = {
        friendId: user.userId,
        isAccept: 1,
    };
    acceptFriendService(body)
        .then((res) => {
            if (res.status === 200) {
                friendStore.addFriend(user);
                friendStore.removePendingByUserId(user.userId);
                friendStore.setNumberPending(friendStore.getNumberPending - 1);
                friendStore.setNumberFriend(friendStore.getNumberFriend + 1);
            } else {
                toast.error('Có lỗi xảy ra', { timeout: 3000 });
            }
        })
        .catch((e) => {
            toast.error('Có lỗi xảy ra thử lại sau', { timeout: 3000 });
        });
};

const handleDenyFriend = (user) => {
    const body = {
        friendId: user.userId,
        isAccept: 0,
    };
    acceptFriendService(body)
        .then((res) => {
            if (res.status === 200) {
                // friendStore.updatePending({ friendId: user.userId, status: 'CLOSE_FRIEND' });\
                friendStore.removePending(user.userId);
                friendStore.setNumberPending(friendStore.getNumberPending - 1);
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

const router = useRouter();
const handleNavigateToProfile = (userId) => {
    router.push(`/profile/${userId}`);
};

onMounted(() => {
    loadMoreFriends();
});
</script>

<template>
    <div class="friend-list-container">
        <div v-if="numberPendings > 0">
            <span> Danh sách yêu cầu kết bạn </span>
            <span class="font-weight-bold"> {{ numberPendings }} người </span>
        </div>
        <div v-for="(friend, index) in friends" :key="friend.user.userId" class="friend-item">
            <img :src="friend.user.avatar || icons.defaultAvatar" alt="Avatar" class="friend-avatar" />
            <div class="friend-info">
                <h3 @click="handleNavigateToProfile(friend.user.userId)" style="cursor: pointer">{{ friend.user.firstName }} {{ friend.user.lastName }}</h3>
                <p>{{ friend.user.userEmail }}</p>
                <p>Bạn chung: {{ friend.mutualFriendsQuantity }}</p>
                <!-- <p>Quan hệ: {{ friend.status }}</p> -->
                <p>Status: {{ status.find((item) => item.value === friend.status).label }}</p>
            </div>
            <div class="friend-actions">
                <button v-if="friend.status === 'PENDING'" @click="handleAcceptFriend(friend.user)">Đồng ý</button>
                <button v-if="friend.status === 'PENDING'" @click="handleDenyFriend(friend.user)">Từ chối</button>
                <button v-if="friend.status !== 'BLOCK'" @click="handleOpenDialogBlockUser(friend.user)">Chặn</button>
            </div>
        </div>

        <div v-if="friends.hasMore" class="load-more-container">
            <button @click="loadMoreFriends" :disabled="friends.isLoading" class="load-more-button">Load More</button>
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
