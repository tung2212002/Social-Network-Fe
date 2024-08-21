<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import HeartOutline from 'vue-material-design-icons/HeartOutline.vue';
import ChartBar from 'vue-material-design-icons/ChartBar.vue';
import MessageOutline from 'vue-material-design-icons/MessageOutline.vue';
import Sync from 'vue-material-design-icons/Sync.vue';
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue';
import TrashCanOutline from 'vue-material-design-icons/TrashCanOutline.vue';
import { icons } from '@/assets';
import getDeltaTime from '@/utils/getDeltaTime';

const props = defineProps({
    tweet: Object,
});

const tweet = props.tweet;

console.log('Tweet Data:', tweet);

let openOptions = ref(false);
</script>

<template>
    <div class="min-w-[60px]">
        <img class="rounded-full m-2 mt-3" width="50" :src="tweet?.user?.avatar || icons.defaultAvatar" />
    </div>
    <div class="p-2 w-full">
        <div class="font-extrabold flex items-center justify-between mt-0.5 mb-1.5">
            <div class="flex items-center">
                <div>{{ tweet?.user.lastName }} {{ tweet?.user.firstName }}</div>
                <span class="font-[300] text-[15px] text-gray-500 pl-2">{{ tweet.user?.userEmail }}</span>
                <span class="font-[300] text-[15px] text-gray-500 pl-2">{{ getDeltaTime(tweet.createAt) }}</span>
            </div>
            <div class="hover:bg-gray-800 rounded-full cursor-pointer relative">
                <button type="button" class="block p-2">
                    <DotsHorizontal @click="openOptions = !openOptions" />
                </button>
                <div v-if="openOptions" class="absolute mt-1 right-0 w-[300px] bg-black border border-gray-700 rounded-lg shadow-lg">
                    <ul class="p-3">
                        <RouterLink as="button" method="delete" :href="route('tweets.destroy', { id: tweet.postId })" class="flex items-center cursor-pointer">
                            <TrashCanOutline class="pr-3" fillColor="#DC2626" :size="18" />
                            <span class="text-red-600 font-extrabold">Delete</span>
                        </RouterLink>
                    </ul>
                </div>
            </div>
        </div>
        <div class="pb-3">{{ tweet.content }}</div>
        <v-row>
            <v-col v-for="image in tweet.imagePosts" :key="image.imageId" class="d-flex child-flex" cols="6">
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
                <span class="text-xs font-extrabold text-[#5e5c5c] ml-3">{{ tweet.commentQuantity }}</span>
            </div>
            <!-- <div class="flex">
                <Sync fillColor="#5e5c5c" :size="18" />
                <span class="text-xs font-extrabold text-[#5e5c5c] ml-3">{{ tweet.retweets }}</span>
            </div> -->
            <div class="flex">
                <HeartOutline fillColor="#5e5c5c" :size="18" />
                <span class="text-xs font-extrabold text-[#5e5c5c] ml-3">{{ tweet.reactionsQuantity }}</span>
            </div>
            <!-- <div class="flex">
                <ChartBar fillColor="#5e5c5c" :size="18" />
                <span class="text-xs font-extrabold text-[#5e5c5c] ml-3">{{ tweet.analytics }}</span>
            </div> -->
        </div>
    </div>
</template>

<style scoped>
.post {
}
</style>
