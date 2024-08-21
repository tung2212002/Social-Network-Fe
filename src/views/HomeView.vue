<script setup>
import route from '@/constants/route';
import { logoutService } from '@/services/user/authService';
import { useUserStore } from '@/stores';
import { removeAll } from '@/utils/authStorage/authLocalStorage';
import { useRouter } from 'vue-router';
import ContentPostComponent from '@/components/ContentPostComponent.vue';
import { onMounted, reactive } from 'vue';
import { suggestPostSerive } from '@/services/post/postService';
import TweetComponent from '@/components/TweetComponent.vue';

const userStore = useUserStore();
const user = userStore.user;
console.log(user);
const router = useRouter();

const state = reactive({
    tweets: {
        posts: [],
        page: 1,
        limit: 5,
        isLoading: false,
        hasMore: true, // Biến để kiểm tra xem còn dữ liệu để load thêm không
    },
});

onMounted(() => {
    suggestPostSerive()
        .then((res) => {
            if (res.status === 200) {
                const newPosts = res.data.data;
                if (newPosts.length < state.tweets.limit) {
                    state.tweets.hasMore = false;
                }
                state.tweets.posts.push(...newPosts);
                state.tweets.page += 1;
                console.log(state.tweets);
            }
        })
        .catch((err) => {
            console.error(err);
            state.tweets.isLoading = false;
        });
});
</script>

<template>
    <ContentPostComponent>
        <div class="text-white">
            <div class="flex" v-for="tweet in state.tweets.posts" :key="tweet.postId">
                <TweetComponent :tweet="tweet" />
            </div>
            <div class="border-b border-b-gray-800 mt-2"></div>
        </div>
    </ContentPostComponent>
</template>

<style scoped>
.flex {
    border: 1px solid #ccc;
}
</style>
