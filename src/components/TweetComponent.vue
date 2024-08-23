<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import HeartOutline from 'vue-material-design-icons/HeartOutline.vue';
import MessageOutline from 'vue-material-design-icons/MessageOutline.vue';
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue';
import TrashCanOutline from 'vue-material-design-icons/TrashCanOutline.vue';
import { icons } from '@/assets';
import getDeltaTime from '@/utils/getDeltaTime';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'ant-design-vue/es/anchor';
import { useDialogStore, useLoadingStore, usePostStore, useUserStore } from '@/stores';
import ConfirmDialog from './ConfirmDialog.vue';
import { deltePostService } from '@/services/post/postService';
import { useToast } from 'vue-toastification';
import { blockUserService } from '@/services/friend/blockSerice';

const props = defineProps({
    post: Object,
});
const toast = useToast();
const postStore = usePostStore();
const user = useUserStore().getUser;
const post = props.post;
const dialogStore = useDialogStore();

const isOwner = computed(() => {
    return user.userId === post.user.userId;
});
const openDialog = computed(() => dialogStore.getDialog);

// const openDialog = ref(false);
let openOptions = ref(false);

const handleDeletePost = () => {
    deltePostService(post.postId)
        .then((res) => {
            if (res.status == 200) {
                // openDialog.value = false;
                dialogStore.hidden();
                postStore.removePost(post.postId);
                toast.success('Xóa bài viết thành công', { timeout: 3000 });
            } else {
                toast.error('Xóa bài viết thất bại', { timeout: 3000 });
            }
        })
        .catch((e) => {
            toast.error('Có lỗi xảy ra thử lại sau', { timeout: 3000 });
        });
};

const handleEditPost = () => {
    console.log('Edit post');
};

const handleBlockUser = () => {
    const body = {
        userId: post.user.userId,
    };
    blockUserService(body)
        .then((res) => {
            if (res.status === 200) {
                postStore.removePostByUserId(post.user.userId);
                toast.success('Chặn người dùng thành công', { timeout: 3000 });
            } else {
                toast.error('Chặn người dùng thất bại', { timeout: 3000 });
            }
        })
        .catch((e) => {
            toast.error('Có lỗi xảy ra thử lại sau', { timeout: 3000 });
        });
};

const dialogInfo = reactive({
    title: '',
    content: '',
    agreeText: '',
    disagreeText: '',
    agreeFunc: () => {},
    disagreeFunc: () => {},
    isShow: false,
});

const handleOpenDialogDeletePost = () => {
    dialogStore.show('Xác nhận xóa bài viết', 'Bạn sẽ không thể khôi phục bài viết này sau khi xóa', 'Xóa', 'Thoát', handleDeletePost, closeDialog);
    console.log('open dialog', dialogStore.getDialogInfo);
    // dialogInfo.title = 'Xác nhận xóa bài viết';
    // dialogInfo.content = 'Bạn sẽ không thể khôi phục bài viết này sau khi xóa';
    // dialogInfo.agreeText = 'Xóa';
    // dialogInfo.disagreeText = 'Thoát';
    // dialogInfo.agreeFunc = handleDeletePost;
    // dialogInfo.disagreeFunc = closeDialog;
    // dialogInfo.isShow = true;
};

const handleOpenDialogBlockUser = () => {
    // dialogInfo.title = 'Chặn người dùng';
    // dialogInfo.content = `Bạn và ${post.user.lastName} ${post.user.firstName} sẽ không thể nhìn thấy nhau trên mạng xã hội`;
    // dialogInfo.agreeText = 'Chặn';
    // dialogInfo.disagreeText = 'Thoát';
    // dialogInfo.agreeFunc = handleBlockUser;
    // dialogInfo.disagreeFunc = closeDialog;
    // dialogInfo.isShow = true;
    dialogStore.show(
        'Chặn người dùng',
        `Bạn và ${post.user.lastName} ${post.user.firstName} sẽ không thể nhìn thấy nhau trên mạng xã hội`,
        'Chặn',
        'Thoát',
        handleBlockUser,
        closeDialog,
    );
};

const closeDialog = () => {
    // dialogInfo.isShow = false;
    dialogStore.hidden();
};

const actions = [
    {
        icon: 'ri-delete-bin-line',
        text: 'Xóa bài viết',
        color: 'red',
        isOwner: true,
        class: 'delete-post-btn',
        action: handleOpenDialogDeletePost,
    },
    {
        icon: 'ri-edit-box-line',
        text: 'Chỉnh sửa bài viết',
        isOwner: true,
        action: handleEditPost,
    },
    {
        icon: 'ri-lock-2-line',
        text: 'Chặn chủ bài viết',
        notMe: true,
        action: handleOpenDialogBlockUser,
    },
];
</script>

<template>
    <div class="min-w-[60px]">
        <img class="rounded-full m-2 mt-3" width="50" :src="post?.user?.avatar || icons.defaultAvatar" />
    </div>
    <div class="p-2 w-full">
        <div class="font-extrabold flex items-center justify-between mt-0.5 mb-1.5">
            <div class="flex items-center">
                <div>{{ post?.user.lastName }} {{ post?.user.firstName }}</div>
                <span class="font-[300] text-[15px] text-gray-500 pl-2">{{ post.user?.userEmail }} </span>
                <i class="ri-circle-fill icon-dot"></i>

                <span class="font-[300] text-[15px] text-gray-500 pl-2">{{ getDeltaTime(post.createAt) }}</span>
            </div>

            <v-container fluid class="hover:bg-gray-800 rounded-full cursor-pointer relative dots-btn">
                <v-row justify="center">
                    <v-menu rounded activator="parent" location="bottom">
                        <template v-slot:activator="{ props }">
                            <button type="button" class="block p-2">
                                <DotsHorizontal @click="openOptions = !openOptions" />
                            </button>
                        </template>

                        <v-card class="menu">
                            <ul v-for="(action, index) in actions" :key="index" class="p-0 m-0">
                                <v-btn
                                    class="text-red-600 font-normal hover:bg-gray-800 rounded-full cursor-pointer menu-btn"
                                    v-if="(action.isOwner && isOwner) || (action.notMe && !isOwner)"
                                    @click="action.action"
                                >
                                    <i :class="action.icon"></i>
                                    <span class="font-normal menu-text" :class="`text-${action.color}` + ' ' + action.class">{{ action.text }}</span>
                                </v-btn>
                            </ul>
                        </v-card>
                    </v-menu>
                </v-row>
            </v-container>
        </div>
        <div class="pb-3">{{ post.content }}</div>
        <v-row>
            <v-col
                v-for="(image, index) in post.imagePosts"
                :key="index"
                :cols="post.imagePosts.length % 2 === 1 && index === post.imagePosts.length - 1 ? 12 : 6"
            >
                <v-img :src="image.imageUrl" aspect-ratio="1" class="bg-grey-lighten-2" cover>
                    <template v-slot:placeholder>
                        <v-row align="center" class="fill-height ma-0" justify="center">
                            <v-progress-circular color="grey-lighten-5" indeterminate></v-progress-circular>
                        </v-row>
                    </template>
                </v-img>
            </v-col>
        </v-row>
        <div class="flex items-center justify-between mt-4 w-4/5">
            <div class="flex">
                <MessageOutline fillColor="#5e5c5c" :size="18" />
                <span class="text-xs font-extrabold text-[#5e5c5c] ml-3">{{ post.commentQuantity }}</span>
            </div>
            <div class="flex">
                <HeartOutline fillColor="#5e5c5c" :size="18" />
                <span class="text-xs font-extrabold text-[#5e5c5c] ml-3">{{ post.reactionsQuantity }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.menu {
    transform: translateX(-160px);
    border: 1px solid #ccc;
    box-shadow: 5px 5px 10px 5px grey;
    background-color: black;
}

.icon-dot {
    font-size: 3px;
    padding-left: 6px;
}

.delete-post {
    border: 1px solid #ccc !important;
    border-radius: 12px;
}

.menu-btn {
    display: flex;
    width: 100%;
    justify-content: flex-start;
}

.menu-text {
    margin-left: 10px;
    text-transform: none;
    font-size: 15px;
    font-weight: 600;
}
.dots-btn {
    width: fit-content;
    margin: 0;
}

.delete-post-btn {
    text-transform: none;
}

.pa-4 {
    padding: 0 !important;
}
</style>
