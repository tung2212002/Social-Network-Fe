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

const usePost = usePostStore();
const loading = computed(() => usePost.getIsLoadingHomePost);

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
    const params = {
        page: state.friends.page,
        size: state.friends.size,
    };

    getSuggestFriendService(params)
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
        <div class="bg-black bg-opacity-50 backdrop-blur-md z-0 absolute w-full">
            <div class="border-gray-800 border-b w-full">
                <div class="w-full text-white text-[22px] font-extrabold p-4">Home</div>
                <div class="flex">
                    <div
                        class="flex items-center justify-center w-full h-[60px] text-white text-[17px] font-extrabold p-4 hover:bg-gray-500 hover:bg-opacity-30 cursor-pointer transition duration-200 ease-in-out"
                    >
                        <div class="inline-block text-center border-b-4 border-b-[#1C9CEF] h-[60px]">
                            <div class="my-auto mt-4">For you</div>
                        </div>
                    </div>
                    <div
                        class="w-full h-[60px] text-gray-500 text-[17px] font-extrabold p-4 hover:bg-gray-500 hover:bg-opacity-30 cursor-pointer transition duration-200 ease-in-out"
                    >
                        <div class="text-center">Following</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="absolute w-full top-0 z-0 post">
            <div class="mt-[126px]"></div>
            <slot />
            <div class="pb-4"></div>
        </div>
    </div>

    <div class="lg:block hidden lg:w-4/12 h-screen border-l border-gray-800 pl-4">
        <div class="w-full p-1 mt-2 px-4 lg:flex items-center rounded-full hidden bg-[#212327]">
            <Magnify fillColor="#5e5c5c" :size="25" />
            <input
                class="appearance-none w-full border-0 py-2 bg-[#212327] text-gray-100 placeholder-gray-500 leading-tight focus:ring-0"
                type="text"
                placeholder="Search Twitter"
            />
        </div>

        <div class="w-full mt-4 rounded-lg lg:block hidden border-1">
            <div class="w-full pt-4 pl-4 text-white font-bold text-[20px]">Có thể bạn biết</div>

            <div v-for="(friend, index) in state.friends.users" :key="index" class="hover:bg-gray-800 cursor-pointer transition duration-200 ease-in-out">
                <div class="flex p-3 justify-between">
                    <SuggestFriendComponent :friend="friend" />
                    <DotsHorizontal fillColor="#5e5c5c" />
                </div>
            </div>
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
