<script setup>
import { icons } from '@/assets';
import { blockUserService, getListBlockUserService, unBlockUserService } from '@/services/friend/blockSerice';
import { getFriendListService } from '@/services/friend/friendService';
import { useDialogStore, useFriendshipStore } from '@/stores';
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

const blocks = reactive({
    isLoading: true,
    page: 0,
    size: 10,
    hasMore: true,
    firstLoad: true,
});
const dialogStore = useDialogStore();

const friendStore = useFriendshipStore();
const listBlock = computed(() => friendStore.getBlocks);
const numberOfBlocks = computed(() => friendStore.getNumberBlock);
const toast = useToast();

const loadMoreBlocks = () => {
    console.log('loadMoreBlocks');
    blocks.isLoading = true;
    const params = {
        page: blocks.page,
        size: blocks.size,
    };
    getListBlockUserService(params)
        .then((res) => {
            if (res.status === 200) {
                if (blocks.firstLoad) {
                    friendStore.setBlocks(res.data.data.friendshipUsers);
                    blocks.firstLoad = false;
                } else {
                    friendStore.addListBlock(...res.data.data.friendshipUsers);
                }
                if (res.data.data.friendshipUsers.length < blocks.size) {
                    blocks.hasMore = false;
                }
                blocks.page++;
                friendStore.setNumberBlock(res.data.data.friendQuantity);
            }
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            blocks.isLoading = false;
        });
};

const closeDialog = () => {
    dialogStore.hidden();
};

const handleOpenDialogUnBlockUser = (user) => {
    dialogStore.show(
        'Bỏ chặn người dùng',
        `Bạn có chắc chắn muốn bỏ chặn người dùng ${user.firstName} ${user.lastName}?`,
        'Bỏ chặn',
        'Thoát',
        unBlock,
        closeDialog,
        { userId: user.userId },
    );
};

const unBlock = () => {
    const body = {
        userId: dialogStore.data.userId,
    };

    unBlockUserService(body)
        .then((res) => {
            if (res.status === 200) {
                friendStore.removeBlockByUserId(dialogStore.data.userId);
                friendStore.setNumberBlock(numberOfBlocks.value - 1);
                dialogStore.hidden();
                toast.success('Bỏ chặn người dùng thành công', { timeout: 3000 });
            } else {
                toast.error('Có lỗi xảy ra', { timeout: 3000 });
            }
        })
        .catch((err) => {
            toast.error('Có lỗi xảy ra', { timeout: 3000 });
            console.error(err);
        });
};

onMounted(() => {
    loadMoreBlocks();
});
</script>

<template>
    <div class="friend-list-container">
        <div v-if="numberOfBlocks > 0">
            <span>Danh sách chặn </span>
            <span class="font-weight-bold">{{ numberOfBlocks }} người</span>
        </div>
        <div v-for="(friend, index) in listBlock" :key="friend.user.userId" class="friend-item">
            <img :src="friend.user.avatar || icons.defaultAvatar" alt="Avatar" class="friend-avatar" />
            <div class="friend-info">
                <h3>{{ friend.user.firstName }} {{ friend.user.lastName }}</h3>
                <p>{{ friend.user.userEmail }}</p>
                <p v-if="friend.status === 'BLOCK'">Status: Chặn</p>
            </div>
            <div class="friend-actions">
                <button @click="handleOpenDialogUnBlockUser(friend.user)" v-if="friend.status === 'BLOCK'">Bỏ chặn</button>
            </div>
        </div>

        <div v-if="blocks.hasMore" class="load-more-container">
            <button @click="loadMoreFriends" :disabled="blocks.isLoading" class="load-more-button">Load More</button>
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
