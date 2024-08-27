<script setup>
import { icons } from '@/assets';
import {
    createCommentChildService,
    deleteCommentService,
    editCommentService,
    getListCommentChildByCommentIdService,
    reactionCommentService,
} from '@/services/post/commentService';
import getDeltaTime from '@/utils/getDeltaTime';
import { reactive } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CommentChildComponent from './CommentChildComponent.vue';
import ThumbUpOutline from 'vue-material-design-icons/ThumbUpOutline.vue';
import { upImageCommentService } from '@/services/post/imageService';
import { useToast } from 'vue-toastification';
import Close from 'vue-material-design-icons/Close.vue';
import ImageOutline from 'vue-material-design-icons/ImageOutline.vue';
import { useDialogStore, usePostStore, useUserStore } from '@/stores';
import { blockUserService } from '@/services/friend/blockSerice';
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue';
import { computed } from 'vue';

const router = useRouter();
const props = defineProps({
    comment: Object,
    listComment: Array,
});
const toast = useToast();

const comment = ref(props.comment);
const isEdit = ref(false);
const edit = () => {
    isEdit.value = true;
};

const exitEdit = () => {
    isEdit.value = false;
};

const state = reactive({
    page: 0,
    size: 1,
    comment: [],
    hasMore: true,
});

const newCommnet = reactive({
    postId: comment.value.postId,
    content: '',
    publicId: '',
});

const editComment = reactive({
    content: comment.value.content,
    postId: comment.value.postId,
});

const editImage = reactive({
    imageLocal: comment.value.imageUrl,
    publicId: comment.value.imagePublicId,
});

const fileUpload = ref(null);
const image = ref({
    imageLocal: '',
    publicId: '',
});

const reactionType = [
    {
        type: 'LIKE',
        icon: '👍',
    },
    {
        type: 'LOVE',
        icon: '❤️',
    },
    {
        type: 'SMILE',
        icon: '😂',
    },
    {
        type: 'ANGRY',
        icon: '😡',
    },
];

const inputShow = ref(false);

const showMenu = ref(false);

const showReactions = () => {
    showMenu.value = true;
};

const hideReactions = () => {
    showMenu.value = false;
};

const handleReactionDoubleClick = () => {
    console.log('double click');
    showMenu.value = false;
    const body = {
        reactionType: comment.value.reactionType === null ? 'LIKE' : comment.value.reactionType,
    };
    reactionCommentService(comment.value.commentId, body)
        .then((res) => {
            if (res.status === 200) {
                if (res.data.data === null) {
                    comment.value.reactionType = null;
                    comment.value.reactionsQuantity = Number(comment.value.reactionsQuantity) - 1;
                } else {
                    console.log(res.data.data.reactionType);
                    comment.value.reactionType = res.data.data.reactionType;
                    comment.value.reactionsQuantity = Number(comment.value.reactionsQuantity) + 1;
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
};

const handleReaction = (reaction) => {
    const body = {
        reactionType: reaction.toUpperCase(),
    };
    reactionCommentService(comment.value.commentId, body)
        .then((res) => {
            if (res.status === 200) {
                if (res.data.data === null) {
                    comment.value.reactionType = null;
                    comment.value.reactionsQuantity = Number(comment.value.reactionsQuantity) - 1;
                } else {
                    if (comment.value.reactionType === null) {
                        comment.value.reactionsQuantity = Number(comment.value.reactionsQuantity) + 1;
                    }
                    comment.value.reactionType = res.data.data.reactionType;
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
};

const handleNavigateToProfile = (userId) => {
    router.push(`/profile/${userId}`);
};

const getFile = (e) => {
    const file = e.target.files[0];
    if (file.size > 1024 * 1024 * 5) {
        toast.error('File quá lớn', { timeout: 3000 });
    } else if (!file.type.includes('image')) {
        toast.error('File không phải là ảnh', { timeout: 3000 });
    } else {
        fileUpload.value = file;
        handleUploadImagePost();
    }
};

const getFileEdit = (e) => {
    const file = e.target.files[0];
    if (file.size > 1024 * 1024 * 5) {
        toast.error('File quá lớn', { timeout: 3000 });
    } else if (!file.type.includes('image')) {
        toast.error('File không phải là ảnh', { timeout: 3000 });
    } else {
        fileUpload.value = file;
        handleUploadImagePostEdit();
    }
};

const handleUploadImagePost = () => {
    const body = new FormData();
    body.append('image', fileUpload.value);
    upImageCommentService(body)
        .then((res) => {
            if (res.status === 200) {
                image.value.imageLocal = URL.createObjectURL(fileUpload.value);
                image.value.publicId = res.data.data.publicId;
                fileUpload.value = null;
            }
        })
        .catch((err) => {
            console.error(err);
        });
};

const handleUploadImagePostEdit = () => {
    const body = new FormData();
    body.append('image', fileUpload.value);
    upImageCommentService(body)
        .then((res) => {
            if (res.status === 200) {
                console.log(res.data.data.publicId);
                console.log(URL.createObjectURL(fileUpload.value));
                editImage.imageLocal = URL.createObjectURL(fileUpload.value);
                console.log(editImage);
                editImage.publicId = res.data.data.publicId;
                console.log(editImage);
                fileUpload.value = null;
                console.log(editImage);
                console.log('editImage');
            }
        })
        .catch((err) => {
            console.error(err);
        });
};

const addComment = () => {
    const body = {
        postId: newCommnet.postId,
        content: newCommnet.content,
        publicId: image.value.publicId,
    };
    createCommentChildService(comment.value.commentId, body)
        .then((res) => {
            if (res.status === 200) {
                state.comment.unshift(res.data.data);
                newCommnet.content = '';
                newCommnet.publicId = '';
                image.value.imageLocal = '';
                image.value.publicId = '';
                emit('addComment', res.data.data);
            } else if (res.status === 400) {
                toast.error('Hình như bài đăng hơi linh tinh :(((', { timeout: 3000 });
            }
        })
        .catch((err) => {
            console.error(err);
        });
};

const handleEditComment = () => {
    const body = {
        postId: editComment.postId,
        content: editComment.content,
        publicId: editImage.publicId,
    };
    editCommentService(comment.value.commentId, body)
        .then((res) => {
            if (res.status === 200) {
                comment.value.content = res.data.data.content;
                comment.value.imageUrl = res.data.data.imageUrl;
                isEdit.value = false;
                // emit('addComment', res.data.data);
            } else if (res.status === 400) {
                toast.error('Hình như bài đăng hơi linh tinh :(((', { timeout: 3000 });
            }
        })
        .catch((err) => {
            console.error(err);
        });
};

const dialogStore = useDialogStore();
const postStore = usePostStore();
const emit = defineEmits(['update:listComment', 'deleteComment', 'addComment', 'deleteCommentChild']);

const handleDeleteComment = () => {
    deleteCommentService(comment.value.commentId)
        .then((res) => {
            if (res.status == 200) {
                emit('deleteComment', comment.value.commentId);
                dialogStore.hidden();
                toast.success('Xóa bình luận thành công', { timeout: 3000 });
            } else {
                toast.error('Xóa bình luận thất bại', { timeout: 3000 });
            }
        })
        .catch((e) => {
            toast.error('Có lỗi xảy ra thử lại sau', { timeout: 3000 });
        });
};

const handleDeleteCommentChild = (commentId) => {
    state.comment = state.comment.filter((c) => c.commentId !== commentId);
    comment.value.repliesQuantity -= 1;
    emit('deleteCommentChild', commentId);
};

const handleOpenDialogDeleteComment = () => {
    dialogStore.show('Xác nhận xóa bình luận', 'Bạn sẽ không thể khôi phục bình luận này sau khi xóa', 'Xóa', 'Thoát', handleDeleteComment, closeDialog);
};

const handleBlockUser = () => {
    const body = {
        userId: comment.value.user.userId,
    };
    blockUserService(body)
        .then((res) => {
            if (res.status === 200) {
                postStore.removePostByUserId(comment.value.user.userId);
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

const handleOpenDialogBlockUser = () => {
    dialogStore.show(
        'Chặn người dùng',
        `Bạn và ${comment.value.user.lastName} ${comment.value.user.firstName} sẽ không thể nhìn thấy nhau trên mạng xã hội`,
        'Chặn',
        'Thoát',
        handleBlockUser,
        closeDialog,
    );
};

const closeDialog = () => {
    dialogStore.hidden();
};

const handleOpenEditComment = () => {
    edit();
};

const actions = [
    {
        icon: 'ri-delete-bin-line',
        text: 'Xóa bình luận',
        color: 'red',
        isOwner: true,
        class: 'delete-post-btn',
        action: handleOpenDialogDeleteComment,
    },
    {
        icon: 'ri-edit-box-line',
        text: 'Chỉnh sửa bình luận',
        isOwner: true,
        action: handleOpenEditComment,
    },
    {
        icon: 'ri-lock-2-line',
        text: 'Chặn chủ bình luận',
        notMe: true,
        action: handleOpenDialogBlockUser,
    },
];

let openOptions = ref(false);
const removeImage = () => {
    image.value.imageLocal = '';
    image.value.publicId = '';
};

const removeEditImage = () => {
    editImage.imageLocal = '';
    editImage.publicId = '';
};

const handleGetMoreComment = () => {
    const params = {
        page: state.page,
        size: state.size,
    };
    getListCommentChildByCommentIdService(comment.value.commentId, params)
        .then((res) => {
            if (res.status === 200) {
                state.comment.push(...res.data.data);
                state.page += 1;
                if (res.data.data.length < state.size) {
                    state.hasMore = false;
                }
            } else {
                console.error(res);
            }
        })
        .catch((err) => {
            console.error(err);
        });
};

const user = useUserStore().getUser;

const isOwner = computed(() => {
    return user.userId === comment.value.user.userId;
});
</script>

<template>
    <div class="w-full flex relative">
        <v-container fluid class="hover:bg-gray-800 rounded-full cursor-pointer absolute top-0 right-0 dots-btn">
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
        <div class="min-w-[60px] avatar" @click="handleNavigateToProfile(comment.user.userId)">
            <img class="rounded-full m-2 mt-3" width="50" :src="comment?.user?.avatar || icons.defaultAvatar" />
        </div>
        <div class="w-fit-content p-2 flex flex-col justify-center bg-gray-100 rounded-lg m-2">
            <div class="flex items-center">
                <div @click="handleNavigateToProfile(comment.user.userId)" class="full-name">{{ comment?.user.lastName }} {{ comment?.user.firstName }}</div>
                <span class="font-[300] text-[15px] text-gray-500 pl-2">.</span>
                <span class="font-[300] text-[15px] text-gray-500 pl-2">
                    {{ comment?.user?.userEmail }}
                </span>
            </div>
            <div v-if="!isEdit" class="mt-2">
                {{ comment.content }}
            </div>
            <v-col class="relative" v-if="comment.imageUrl && !isEdit" style="max-height: 100px; padding-left: 0">
                <v-img :src="comment.imageUrl" aspect-ratio="1" class="bg-grey-lighten-2 border-radius-10 rounded-xl image" cover style="max-height: 100px">
                    <template v-slot:placeholder>
                        <v-row align="center" class="ma-0" justify="center">
                            <v-progress-circular color="grey-lighten-5" indeterminate></v-progress-circular>
                        </v-row>
                    </template>
                </v-img>
            </v-col>

            <div class="input-container-edit relative" v-if="isEdit">
                <div class="hover:bg-gray-800 inline-block p-2 rounded-full cursor-pointer mr-1 w-10 h-10">
                    <label :for="`fileUpload-comment-edit-${comment.commentId}`" class="cursor-pointer">
                        <ImageOutline fillColor="#1C9CEF" :size="25" />
                    </label>
                    <input type="file" :id="`fileUpload-comment-edit-${comment.commentId}`" class="hidden" @change="getFileEdit" />
                </div>
                <div class="flex-1 images-input">
                    <v-col class="relative" v-if="editImage.imageLocal" style="max-height: 100px">
                        <div
                            @click="removeEditImage()"
                            class="hover:bg-gray-800 inline-block rounded-full cursor-pointer absolute top-5 right-5 bg-black hover:bg-gray-800 z-10 p-1 close-icon"
                        >
                            <Close fillColor="#FFFFFF" :size="24" class="" />
                        </div>
                        <v-img
                            :src="editImage.imageLocal"
                            aspect-ratio="1"
                            class="bg-grey-lighten-2 border-radius-10 rounded-xl image"
                            cover
                            style="max-height: 100px"
                        >
                            <template v-slot:placeholder>
                                <v-row align="center" class="ma-0" justify="center">
                                    <v-progress-circular color="grey-lighten-5" indeterminate></v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>
                    </v-col>
                    <input type="text" placeholder="Nhập bình luận..." v-model="editComment.content" class="mt-4 w-full" />
                </div>

                <button @click="handleEditComment" color="primary" class="mr-2" :disabled="!editComment.content && !editImage.imageLocal">
                    <span class="font-[300] text-[15px] text-gray-500 font-bold">Gửi</span>
                </button>
                <span
                    class="font-[300] text-[12px] text-gray-500 font-bold pl-2 absolute top-100 left-0 hover:bg-gray-800 inline-block rounded-full cursor-pointer p-1"
                    @click="exitEdit"
                >
                    Hủy
                </span>
            </div>
        </div>
    </div>
    <div class="flex items-center pl-20 pb-2">
        <span class="font-[300] text-[12px] text-gray-500 font-bold">{{ getDeltaTime(comment.createAt) }}</span>
        <span class="font-[300] text-[12px] text-gray-500 font-bold pl-2 replies" @click="inputShow = true"> Trả lời </span>
        <div class="flex reaction">
            <div class="reaction-container">
                <div class="reaction-trigger" @mouseover="showReactions" @mouseleave="hideReactions">
                    <span class="reaction-icon" @click="handleReactionDoubleClick">
                        <span v-if="comment.reactionType !== null">
                            <div class="icon" v-if="reactionType.find((r) => r.type === comment.reactionType)">
                                {{ reactionType.find((r) => r.type === comment.reactionType).icon }}
                            </div>
                        </span>
                        <span v-else>
                            <ThumbUpOutline fillColor="#5e5c5c" :size="18" class="flex align-center justify-center like-default" />
                        </span>
                    </span>
                    <div class="reaction-menu-icon" v-if="showMenu">
                        <template v-for="(reaction, index) in reactionType" :key="index">
                            <div class="reaction-option" @click="handleReaction(reaction.type)">{{ reaction.icon }} {{ reaction.type.toUpperCase() }}</div>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <span v-if="comment.reactionsQuantity > 0" class="font-[300] text-[12px] text-gray-500 font-bold pl-2">
            {{ comment.reactionsQuantity }} tương tác
        </span>
    </div>

    <div v-show="state.comment.length > 0" class="comment-replies">
        <div class="flex flex-col" v-for="comment in state.comment" :key="comment.commentId">
            <CommentChildComponent :comment="comment" @deleteCommentChild="handleDeleteCommentChild" />
        </div>
    </div>
    <div
        v-if="comment.repliesQuantity > 0 && state.hasMore && comment.repliesQuantity - state.comment.length > 0"
        class="text-gray-500 text-[15px] font-bold cursor-pointer pl-20 pb-2"
        @click="handleGetMoreComment"
    >
        Xem {{ comment.repliesQuantity - state.comment.length }} phản hồi
    </div>

    <div class="input-container" v-show="inputShow">
        <div class="hover:bg-gray-800 inline-block p-2 rounded-full cursor-pointer mr-1 w-10 h-10">
            <label :for="`fileUpload-comment-${comment.commentId}`" class="cursor-pointer">
                <ImageOutline fillColor="#1C9CEF" :size="25" />
            </label>
            <input type="file" :id="`fileUpload-comment-${comment.commentId}`" class="hidden" @change="getFile" />
        </div>
        <div class="flex-1 images-input">
            <v-col class="relative" v-if="image.imageLocal" style="max-height: 100px">
                <div
                    @click="removeImage()"
                    class="hover:bg-gray-800 inline-block rounded-full cursor-pointer absolute top-5 right-5 bg-black hover:bg-gray-800 z-10 p-1 close-icon"
                >
                    <Close fillColor="#FFFFFF" :size="24" class="" />
                </div>
                <v-img :src="image.imageLocal" aspect-ratio="1" class="bg-grey-lighten-2 border-radius-10 rounded-xl image" cover style="max-height: 100px">
                    <template v-slot:placeholder>
                        <v-row align="center" class="ma-0" justify="center">
                            <v-progress-circular color="grey-lighten-5" indeterminate></v-progress-circular>
                        </v-row>
                    </template>
                </v-img>
            </v-col>
            <input type="text" placeholder="Nhập bình luận..." v-model="newCommnet.content" class="mt-4 w-full" />
        </div>

        <v-btn @click="addComment" color="primary" class="mr-2" :disabled="!newCommnet.content && !image.imageLocal">
            <i class="ri-send-plane-fill"></i>
        </v-btn>
    </div>
</template>

<style>
.image[data-v-19e4945f] {
    min-height: 50px !important;
}
</style>

<style scoped>
.comment {
    position: relative;

    &:hover {
        cursor: pointer;
        background-color: #f1f8ff;
    }
}

.comment-replies {
    margin-left: 40px;
}

.reaction {
    margin-left: 10px;
    position: relative;

    &:hover {
        cursor: pointer;
        background-color: #f1f8ff;
    }
}

.replies {
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}

.avatar {
    cursor: pointer;
}

.full-name {
    font-size: 15px;
    text-transform: capitalize;
    font-weight: 600;

    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
}
.open-comment {
    position: absolute;
    bottom: calc(50% - 20px);
    right: calc(50% - 80px);
}

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

.tag-user-more {
    .tag-more-detail {
        display: none;
        position: absolute;
        top: 200%;
        right: 0;
        padding: 5px;
        background-color: #f1f8ff;
        border-radius: 5px;
    }

    &:hover {
        .tag-more-detail {
            display: block;
        }
    }
}

.reaction-container {
    position: relative;
    display: inline-block;
}

.reaction-trigger {
    cursor: pointer;
}

.reaction-icon {
    font-size: 24px;
}

.reaction-menu-icon {
    position: absolute;
    bottom: calc(100% - 4px);
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    padding: 10px;
    white-space: nowrap;
    z-index: 1000;
}

.reaction-option {
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
    transition:
        background-color 0.3s ease,
        transform 0.3s ease;
}

.reaction-option:hover {
    background: #f0f0f0;
    transform: scale(1.3);
}

.reaction-option .reaction-icon {
    z-index: 10;
    margin-right: 8px;
}

.icon,
.like-default {
    font-size: 18px;
    width: 24px;
    height: 30px;
}

.close {
    position: absolute;
    top: 0 !important;
    right: 0 !important;
    color: white;
    background-color: rgb(37, 37, 37) !important;
    width: 30px;
    height: 30px;
    padding: 0 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    cursor: pointer;

    &:hover {
        background-color: rgb(107, 79, 79) !important;
    }
}

.input-container {
    margin-left: 50px;
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.input-container-edit {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.input-container input[type='text'] {
    border: none;
    outline: none;
    flex: 1;
    padding: 10px;
    font-size: 16px;
    color: #333;
    background-color: transparent;
}

.input-container input[type='file'] {
    display: none;
}

.input-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #007bff;
    margin-right: 10px;
    font-size: 16px;
}

.input-label i {
    margin-right: 5px;
    font-size: 20px;
}

.input-label:hover {
    color: #0056b3;
}

.image-input {
    max-height: 200px;
}

.image {
    min-height: 200px;
}
</style>
