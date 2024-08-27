<script setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ThumbUpOutline from 'vue-material-design-icons/ThumbUpOutline.vue';
import MessageOutline from 'vue-material-design-icons/MessageOutline.vue';
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue';
import { icons } from '@/assets';
import getDeltaTime from '@/utils/getDeltaTime';
import { useCreaPostStore, useDialogStore, useModalStore, usePostStore, useUserStore } from '@/stores';
import { deltePostService, reactionPostService } from '@/services/post/postService';
import { useToast } from 'vue-toastification';
import { blockUserService } from '@/services/friend/blockSerice';
import ListCommentComponent from './ListCommentComponent.vue';
import ReactionComponent from './ReactionComponent.vue';

const props = defineProps({
    post: Object,
});

const toast = useToast();
const postStore = usePostStore();
const user = useUserStore().getUser;
const post = props.post;
const dialogStore = useDialogStore();
const creatPostStore = useCreaPostStore();
const modalStore = useModalStore();
const openComment = ref(false);
const router = useRouter();

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

const showMenu = ref(false);

const showReactions = () => {
    showMenu.value = true;
};

const hideReactions = () => {
    showMenu.value = false;
};

const isOwner = computed(() => {
    return user.userId === post.user.userId;
});
let openOptions = ref(false);

const handleDeletePost = () => {
    deltePostService(post.postId)
        .then((res) => {
            if (res.status == 200) {
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

const handleOpenEditPost = () => {
    creatPostStore.showUpdate(post.postId);
};

const handleOpenTagUser = () => {
    modalStore.show(post.tagUsers);
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
                dialogStore.hidden();
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
};

const handleOpenDialogBlockUser = () => {
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
    dialogStore.hidden();
};

const handleNavigateToProfile = (userId) => {
    router.push(`/profile/${userId}`);
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
        action: handleOpenEditPost,
    },
    {
        icon: 'ri-lock-2-line',
        text: 'Chặn chủ bài viết',
        notMe: true,
        action: handleOpenDialogBlockUser,
    },
];

const status = [
    {
        id: 1,
        name: 'Mọi người',
        state: 'PUBLIC',
        icon: 'ri-global-line',
    },
    {
        id: 2,
        name: 'Chỉ mình tôi',
        state: 'PRIVATE',
        icon: 'ri-git-repository-private-line',
    },
    {
        id: 3,
        name: 'Bạn bè',
        state: 'FRIEND',
        icon: 'ri-group-line',
    },
];

const handleOpenComment = () => {
    openComment.value = !openComment.value;
};

const handleReactionDoubleClick = () => {
    console.log('double click');
    showMenu.value = false;
    const body = {
        reactionType: post.reactionType === null ? 'LIKE' : post.reactionType,
    };
    reactionPostService(post.postId, body)
        .then((res) => {
            if (res.status === 200) {
                if (res.data.data === null) {
                    post.reactionType = null;
                    post.reactionsQuantity = Number(post.reactionsQuantity) - 1;
                } else {
                    console.log(res.data.data.reactionType);
                    post.reactionType = res.data.data.reactionType;
                    post.reactionsQuantity = Number(post.reactionsQuantity) + 1;
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
    reactionPostService(post.postId, body)
        .then((res) => {
            if (res.status === 200) {
                if (res.data.data === null) {
                    post.reactionType = null;
                    post.reactionsQuantity = Number(post.reactionsQuantity) - 1;
                } else {
                    if (post.reactionType === null) {
                        post.reactionsQuantity = Number(post.reactionsQuantity) + 1;
                    }
                    post.reactionType = res.data.data.reactionType;
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
};
</script>

<template>
    <div class="min-w-[60px]">
        <img
            class="rounded-full m-2 mt-3 avatar"
            width="50"
            :src="post?.user?.avatar || icons.defaultAvatar"
            @click="handleNavigateToProfile(post.user.userId)"
        />
    </div>
    <div class="p-2 w-full">
        <div class="font-extrabold flex items-center justify-between mt-0.5 mb-1.5">
            <div class="block">
                <div class="flex items-center">
                    <div class="full-name" @click="handleNavigateToProfile(post.user.userId)">{{ post?.user.lastName }} {{ post?.user.firstName }}</div>
                    <span class="font-[300] text-[15px] text-gray-500 pl-2">{{ post.user?.userEmail }} </span>
                    <span v-if="post.tagUsers.length > 0" class="font-[300] text-[15px] text-gray-500 pl-2">
                        cùng với
                        <span class="text-black"> {{ post.tagUsers[0].lastName }} {{ post.tagUsers[0].firstName }} </span>
                        <span v-if="post.tagUsers.length > 1" class="position-relative tag-user-more cursor-pointer" @click="handleOpenTagUser">
                            và {{ post.tagUsers.length - 1 }} người khác
                            <span class="absolute top-10 right-0 hover:bg-gray-800 rounded-full tag-more-detail">
                                <div v-for="(tagUser, index) in post.tagUsers" :key="index">
                                    <span v-if="index > 0" class="text-black"> {{ tagUser.lastName }} {{ tagUser.firstName }} </span>
                                </div>
                            </span>
                        </span>
                    </span>
                </div>
                <div class="flex items-center">
                    <span class="font-[300] text-[15px] text-gray-500 pl-2">{{ getDeltaTime(post.createAt) }}</span>
                    <i class="ri-circle-fill icon-dot"></i>
                    <i :class="status.find((item) => item.state === post.status).icon" class="text-[#5e5c5c] ml-2"></i>
                </div>
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
        <div class="flex items-center justify-between mt-4 w-4/5 reaction-menu">
            <div class="flex comment" @click="handleOpenComment">
                <MessageOutline fillColor="#5e5c5c" :size="18" />
                <span class="text-xs font-extrabold text-[#5e5c5c] ml-3">{{ post.commentQuantity }}</span>
            </div>
            <div class="flex reaction">
                <!-- <ReactionComponent :post="post" @update:reactionPost="handleUpdateReactionPost" /> -->
                <div class="reaction-container">
                    <div class="reaction-trigger" @mouseover="showReactions" @mouseleave="hideReactions">
                        <span class="reaction-icon" @click="handleReactionDoubleClick">
                            <span v-if="post.reactionType !== null">
                                <div class="icon" v-if="reactionType.find((r) => r.type === post.reactionType)">
                                    {{ reactionType.find((r) => r.type === post.reactionType).icon }}
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
                <span class="text-xs font-extrabold text-[#5e5c5c] ml-3">{{ post.reactionsQuantity }}</span>
            </div>
        </div>
        <ListCommentComponent
            v-if="openComment"
            :openComment="openComment"
            class="open-comment"
            :post="post"
            :postId="post.postId"
            @update:openComment="openComment = $event"
            @update:post="post = $event"
        />
    </div>
</template>

<style scoped>
.comment {
    position: relative;

    &:hover {
        cursor: pointer;
        background-color: #f1f8ff;
    }
}

.reaction {
    position: relative;
    display: flex;
    align-items: center;

    &:hover {
        cursor: pointer;
        background-color: #f1f8ff;
    }
}

.avatar {
    cursor: pointer;
}

.reaction-menu {
    min-height: 30px;
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
</style>
