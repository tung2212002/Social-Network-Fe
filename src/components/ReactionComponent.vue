<template>
    <div class="reaction-container">
        <div class="reaction-trigger" @mouseover="showReactions" @mouseleave="hideReactions">
            <span class="reaction-icon" @click="handleReactionDoubleClick">
                <span v-if="reaction !== null">
                    <div class="icon" v-if="reactionType.find((r) => r.type === reaction)">
                        {{ reactionType.find((r) => r.type === reaction).icon }}
                    </div>
                </span>
                <span v-else>
                    <ThumbUpOutline fillColor="#5e5c5c" :size="18" />
                </span>
            </span>
            <div class="reaction-menu" v-if="showMenu">
                <template v-for="(reaction, index) in reactionType" :key="index">
                    <div class="reaction-option" @click="handleReaction(reaction.type)">{{ reaction.icon }} {{ reaction.type.toUpperCase() }}</div>
                </template>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactionPostService } from '@/services/post/postService';
import { ref, watch } from 'vue';
import ThumbUpOutline from 'vue-material-design-icons/ThumbUpOutline';

const reactionType = [
    // like: 'like',
    // love: 'love',
    // smile: 'smile',
    // angry: 'angry',
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

const props = defineProps({
    post: Object,
});

const reaction = ref(props.post.reactionType);

const post = ref(props.post);

const showMenu = ref(false);

const showReactions = () => {
    showMenu.value = true;
};

const hideReactions = () => {
    showMenu.value = false;
};

const emit = defineEmits(['update:reactionPost']);

watch(
    () => reaction.value,
    (newValue) => {
        emit('update:reactionPost', {
            reactionsQuantity: post.value.reactionsQuantity,
            reactionType: newValue,
        });
    },
);

const handleReactionDoubleClick = () => {
    showMenu.value = false;
    const body = {
        reactionType: post.value.reactionType === null ? 'LIKE' : post.value.reactionType,
    };
    reactionPostService(post.value.postId, body)
        .then((res) => {
            if (res.status === 200) {
                if (res.data.data === null) {
                    // post.value.reactionType = null;
                    reaction.value = null;
                    post.value.reactionsQuantity = Number(post.value.reactionsQuantity) - 1;
                } else {
                    console.log(res.data.data.reactionType);
                    // post.value.reactionType = res.data.data.reactionType;
                    reaction.value = res.data.data.reactionType;
                    post.value.reactionsQuantity = Number(post.value.reactionsQuantity) + 1;
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
    reactionPostService(post.value.postId, body)
        .then((res) => {
            if (res.status === 200) {
                if (res.data.data === null) {
                    // post.value.reactionType = null;
                    reaction.value = null;
                    post.value.reactionsQuantity = Number(post.value.reactionsQuantity) - 1;
                } else {
                    // post.value.reactionType = res.data.data.reactionType;
                    reaction.value = res.data.data.reactionType;
                    post.value.reactionsQuantity = Number(post.value.reactionsQuantity) + 1;
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
};
</script>

<style scoped>
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

.reaction-menu {
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
    margin-right: 8px;
}

.icon {
    font-size: 18px;
}
</style>
