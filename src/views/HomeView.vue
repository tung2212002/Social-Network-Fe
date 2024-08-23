<script setup>
import route from '@/constants/route';
import { logoutService } from '@/services/user/authService';
import { usePostStore, useUserStore } from '@/stores';
import { removeAll } from '@/utils/authStorage/authLocalStorage';
import { useRouter } from 'vue-router';
import ContentPostComponent from '@/components/ContentPostComponent.vue';
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { suggestPostSerive } from '@/services/post/postService';
import TweetComponent from '@/components/TweetComponent.vue';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const userStore = useUserStore();
const user = userStore.user;
const router = useRouter();
const postStore = usePostStore();

const posts = computed(() => postStore.getHomePost);
const isLoading = computed(() => postStore.getIsLoadingHomePost);

const state = reactive({
    posts: {
        page: 0,
        size: 10,
        hasMore: true,
        firstLoad: true,
    },
});

const handleGetListPost = () => {
    if (isLoading.value || !state.posts.hasMore) {
        return;
    }
    postStore.setIsLoadingHomePost(true);
    const params = {
        page: state.posts.page,
        size: state.posts.size,
    };

    suggestPostSerive(params)
        .then((res) => {
            if (res.status === 200) {
                const newPosts = res.data.data;
                if (newPosts.length < state.posts.size) {
                    state.posts.hasMore = false;
                    console.log('No more post');
                }
                postStore.addListHomePost(newPosts);
                state.posts.page += 1;
            }
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            postStore.setIsLoadingHomePost(false);
            if (state.posts.firstLoad) {
                state.posts.firstLoad = false;
            }
        });
};

const handleScroll = () => {
    const contentContainer = document.getElementById('content-home-view');
    if (contentContainer) {
        const bottomOfWindow = contentContainer.scrollTop + contentContainer.clientHeight >= contentContainer.scrollHeight;

        if (bottomOfWindow) {
            handleGetListPost();
        }
    }
};

onMounted(() => {
    const contentContainer = document.getElementById('content-home-view');
    if (contentContainer) {
        contentContainer.addEventListener('scroll', handleScroll);
        handleGetListPost();
    }
});

onBeforeUnmount(() => {
    const contentContainer = document.getElementById('content-home-view');
    if (contentContainer) {
        contentContainer.removeEventListener('scroll', handleScroll);
    }
});
</script>

<template>
    <ContentPostComponent>
        <div class="text-white">
            <div class="flex" v-for="post in posts" :key="post.postId">
                <TweetComponent :post="post" />
            </div>
            <div class="text-center text-white">
                <v-skeleton-loader
                    v-for="index in isLoading && (state.posts.firstLoad ? 3 : 1)"
                    :key="index"
                    class="mx-auto mb-2"
                    style="border-radius: 10px"
                    elevation="12"
                    max-width="100%"
                    type="table-heading, list-item-two-line, image, table-tfoot"
                ></v-skeleton-loader>
            </div>
        </div>
    </ContentPostComponent>
</template>

<style scoped>
.flex {
    border-top: 1px solid #ccc;
    padding-right: 10px;
}
</style>
