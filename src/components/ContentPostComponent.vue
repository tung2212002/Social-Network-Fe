<script setup>
import { onMounted, reactive } from 'vue';
import SuggestFriendComponent from './SuggestFriendComponent.vue';

const friend = reactive({
    friends: [],
})

onMounted(() => {
    g()
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
    <div class="lg:w-7/12 w-11/12 border-x border-gray-800 relative scroll-container">
        <div class="bg-black bg-opacity-50 backdrop-blur-md z-10 absolute w-full">
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

        <div class="w-full mt-4 rounded-lg lg:block hidden bg-[#212327]">
            <div class="w-full p-4 text-white font-extrabold mb-6 text-[20px]">Có thể bạn biết</div>

            <div class="hover:bg-gray-800 cursor-pointer transition duration-200 ease-in-out">
                <div class="flex p-3 justify-between">
                    <SuggestFriendComponent />
                    <DotsHorizontal fillColor="#5e5c5c" />
                </div>
            </div>
            <div class="hover:bg-gray-800 cursor-pointer transition duration-200 ease-in-out">
                <div class="flex p-3 justify-between">
                    <SuggestFriendComponent />
                    <DotsHorizontal fillColor="#5e5c5c" />
                </div>
            </div>
            <div class="hover:bg-gray-800 cursor-pointer transition duration-200 ease-in-out">
                <div class="flex p-3 justify-between">
                    <SuggestFriendComponent />
                    <DotsHorizontal fillColor="#5e5c5c" />
                </div>
            </div>

            <div class="hover:bg-gray-800 rounded-b-xl cursor-pointer transition duration-200 ease-in-out">
                <div class="text-blue-500 p-4">Show more</div>
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
    border: 1px solid #ccc;
}
</style>
