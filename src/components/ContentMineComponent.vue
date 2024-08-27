<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import SuggestFriendComponent from './SuggestFriendComponent.vue';
import { getSuggestFriendService } from '@/services/friend/friendService';
import CreatePostComponent from './CreatePostComponent.vue';
import { usePostStore } from '@/stores';
import CreatePostHeaderComponent from './CreatePostHeaderComponent.vue';
import TagUserPostComponent from './TagUserPostComponent.vue';
import TagUserPostComponent2 from './TagUserPostComponent2.vue';
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue';
import { getListPostByUserIdService } from '@/services/post/postService';
import { useRouter } from 'vue-router';

const usePost = usePostStore();
const loading = computed(() => usePost.getIsLoadingHomePost);
const router = useRouter();
let userId = router.currentRoute.value.params.id;
const user = computed(() => userStore.getUser);

const state = reactive({
    friends: {
        users: [],
        page: 0,
        size: 5,
        isLoading: true,
        hasMore: true,
    },
});

onMounted(() => {
    if (!userId) {
        userId = user.value.userId;
    }
    const params = {
        page: state.friends.page,
        size: state.friends.size,
        userId: userId,
    };

    getListPostByUserIdService(params)
        .then((res) => {
            if (res.status === 200) {
                const newListFriend = res.data.data;
                if (newListFriend.length < state.friends.size) {
                    state.friends.hasMore = false;
                }
                state.friends.users.push(...newListFriend);
                state.friends.page += 1;
            }
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            state.friends.isLoading = false;
        });
});
</script>

<template>
    <div class="lg:w-7/12 w-11/12 border-x border-gray-800 relative scroll-container" id="content-home-view">
        <div class="absolute w-full top-0 z-0 post">
            <div class="mt-[126px]"></div>
            <slot />
            <div class="pb-4"></div>
        </div>
    </div>
</template>

<style scoped>
.scroll-container {
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
}

.post {
    margin: 10px 0;
}
</style>
