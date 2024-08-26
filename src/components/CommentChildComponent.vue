<script setup>
import { icons } from '@/assets';
import getDeltaTime from '@/utils/getDeltaTime';
import { reactive } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ThumbUpOutline from 'vue-material-design-icons/ThumbUpOutline.vue';
import { reactionCommentService } from '@/services/post/commentService';

const router = useRouter();
const props = defineProps({
    comment: Object,
});

const comment = ref(props.comment);
const state = reactive({
    page: 0,
    size: 10,
    comment: [],
});
const handleNavigateToProfile = (userId) => {
    router.push(`/profile/${userId}`);
};

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
</script>

<template>
    <div class="w-full flex comment">
        <div class="min-w-[40px] avatar" @click="handleNavigateToProfile(comment.user.userId)">
            <img class="rounded-full m-2 mt-3" width="40" :src="comment?.user?.avatar || icons.defaultAvatar" />
        </div>
        <div class="w-fit-content p-2 flex flex-col justify-center bg-gray-100 rounded-lg m-2">
            <div class="flex items-center">
                <div @click="handleNavigateToProfile(comment.user.userId)" class="full-name">{{ comment?.user.lastName }} {{ comment?.user.firstName }}</div>
                <span class="font-[300] text-[12px] text-gray-500 pl-2">.</span>
                <span class="font-[300] text-[12px] text-gray-500 pl-2">
                    {{ comment?.user?.userEmail }}
                </span>
            </div>
            <div class="text-[13px]">
                {{ comment.content }}
            </div>
        </div>
    </div>
    <div class="flex items-center pl-14 pb-1">
        <span class="font-[300] text-[12px] text-gray-500 font-bold">{{ getDeltaTime(comment.createAt) }}</span>
        <div class="flex reaction">
            <!-- <ReactionComponent :post="post" @update:reactionPost="handleUpdateReactionPost" /> -->
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
            <!-- <span class="text-xs font-extrabold text-[#5e5c5c] ml-3">{{ comment.reactionsQuantity }}</span> -->
        </div>
        <span v-if="comment.reactionsQuantity > 0" class="font-[300] text-[12px] text-gray-500 font-bold pl-2">
            {{ comment.reactionsQuantity }} tương tác
        </span>
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

    &:hover {
        cursor: pointer;
        background-color: #f1f8ff;
    }
}

.avatar {
    cursor: pointer;
}

.full-name {
    font-size: 12px;
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
    font-size: 12px;
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

.like-default {
    margin-left: 10px;
}
</style>
