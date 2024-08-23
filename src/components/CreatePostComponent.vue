<script setup>
import Close from 'vue-material-design-icons/Close.vue';
import ChevronDown from 'vue-material-design-icons/ChevronDown.vue';
import Earth from 'vue-material-design-icons/Earth.vue';
import ImageOutline from 'vue-material-design-icons/ImageOutline.vue';
import FileGifBox from 'vue-material-design-icons/FileGifBox.vue';
import Emoticon from 'vue-material-design-icons/Emoticon.vue';
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue';
import AccountCheck from 'vue-material-design-icons/AccountCheck.vue';
import LockOpenOutline from 'vue-material-design-icons/LockOpenOutline.vue';

import { computed, reactive, ref, watch } from 'vue';
import { useCreaPostStore, usePostStore, useUserStore } from '@/stores';
import { FormKit } from '@formkit/vue';
import { createPostService, upImagePostService } from '@/services/post/postService';
import { useToast } from 'vue-toastification';
import { icons } from '@/assets';

const toast = useToast();
const fileUpload = ref(null);
const store = useCreaPostStore();
const isOpen = computed(() => store.getOpen);
const userStorage = useUserStore();
const user = computed(() => userStorage.user);
const postStore = usePostStore();

const currentImage = ref([]);

const status = [
    {
        id: 1,
        name: 'Mọi người',
        state: 'public',
        icon: 'ri-global-line',
        description: 'Mọi người đều có thể nhìn thấy bài viết của bạn',
    },
    {
        id: 2,
        name: 'Chỉ mình tôi',
        state: 'private',
        icon: 'ri-git-repository-private-line',
        description: 'Chỉ mình bạn có thể nhìn thấy bài viết',
    },
    {
        id: 3,
        name: 'Bạn bè',
        state: 'friend',
        icon: 'ri-group-line',
        description: 'Chỉ những người bạn của bạn mới có thể nhìn thấy bài viết',
    },
];
const post = reactive({
    content: '',
    status: 'public',
    tagUserIds: [],
    imageIds: [],
    publicIds: [],
});

const handleUploadImagePost = () => {
    const body = new FormData();
    body.append('image', fileUpload.value);
    upImagePostService(body)
        .then((res) => {
            if (res.status === 200) {
                post.publicIds.push(res.data.data.publicId);
                currentImage.value.push({
                    publicId: res.data.data.publicId,
                    imageLocal: URL.createObjectURL(fileUpload.value),
                });
            }
        })
        .catch((err) => {
            console.error(err);
        });
};

const handleHide = () => {
    console.log('hide', post.content);

    console.log('hide', !post.content && post.publicIds.length === 0);
    store.hidden();
};

watch(isOpen, (value) => {
    console.log(value);
});

const canPost = computed(() => post.content.trim() || post.publicIds.length > 0);

const closeMessageBox = () => {
    useCreaPostStore.hidden();
    //
};

const resetPost = () => {
    post.content = '';
    post.status = 'public';
    post.tagUserIds = [];
    post.imageIds = [];
    post.publicIds = [];
    currentImage.value = [];
};

const addPost = () => {
    createPostService(post)
        .then((res) => {
            if (res.status === 201) {
                postStore.addPost(res.data.data);
                store.hidden();
                toast.success('Đăng bài thành công', { timeout: 3000 });
                resetPost();
            } else if (res.status === 400) {
                toast.error('Hình như bài đăng hơi linh tinh :(((', { timeout: 3000 });
            }
        })
        .catch((err) => {
            console.error(err);
        });
};

const textareaInput = () => {
    //
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

const removeImage = (publicId) => {
    post.publicIds = post.publicIds.filter((item) => item !== publicId);
    currentImage.value = currentImage.value.filter((item) => item.publicId !== publicId);
};
</script>

<template>
    <div
        id="OverlaySection"
        v-if="isOpen"
        class="fixed top-0 left-0 w-full h-screen md:bg-gray-400 md:bg-opacity-30 md:p-3 z-50 bg-opacity-70 md:bg-gray-400 md:bg-opacity-30 md:p-3 z-50"
    >
        <div class="md:max-w-2xl md:mx-auto md:mt-10 md:rounded-xl bg-black">
            <div class="flex items-center justify-between md:inline-block p-2 ml-2 mt-2 rounded-full cursor-pointer">
                <div @click="handleHide" class="hover:bg-gray-800 inline-block rounded-full cursor-pointer">
                    <Close fillColor="#FFFFFF" :size="24" class="md:block hidden" />
                </div>
            </div>
            <div class="flex items-center justify-between p-2 pt-0">
                <v-btn icon>
                    <v-avatar size="large">
                        <v-img alt="Avatar" :src="user?.avatar || icons.defaultAvatar"> </v-img>
                    </v-avatar>
                </v-btn>
                <v-card-text class="info">
                    <div class="wrapper" @mouseenter="isMenuOpen = true" @mouseleave="isMenuOpen = false">
                        <h4 class="text-lg font-bold">{{ user?.lastName }} {{ user?.firstName }}</h4>
                    </div>
                    <div class="inline-block">
                        <div class="dropdown">
                            <button class="btn dropdown-toggle p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i :class="status.find((item) => item.state === post.status).icon"></i>
                                {{ status.find((item) => item.state === post.status).name }}
                            </button>
                            <ul class="dropdown-menu">
                                <li v-for="item in status" :key="item.id" class="hover:bg-gray-800 cursor-pointer">
                                    <a class="dropdown-item" @click="post.status = item.state">
                                        <i :class="item.icon"></i>
                                        {{ item.name }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </v-card-text>
            </div>
            <div class="w-full flex justify-center">
                <div class="w-[calc(100%-60px)]">
                    <div class="content pt-3">
                        <v-row>
                            <v-col
                                class="relative"
                                v-for="(image, index) in currentImage"
                                :key="index"
                                :cols="currentImage.length % 2 === 1 && index === currentImage.length - 1 ? 12 : 6"
                            >
                                <div
                                    @click="removeImage(image.publicId)"
                                    class="hover:bg-gray-800 inline-block rounded-full cursor-pointer absolute top-5 right-5 bg-black hover:bg-gray-800 z-10 p-1 close-icon"
                                >
                                    <Close fillColor="#FFFFFF" :size="24" class="" />
                                </div>
                                <v-img :src="image.imageLocal" aspect-ratio="1" class="bg-grey-lighten-2 border-radius-10 rounded-xl" cover>
                                    <template v-slot:placeholder>
                                        <v-row align="center" class="fill-height ma-0" justify="center">
                                            <v-progress-circular color="grey-lighten-5" indeterminate></v-progress-circular>
                                        </v-row>
                                    </template>
                                </v-img>
                            </v-col>
                        </v-row>
                        <div>
                            <textarea
                                ref="textarea"
                                :oninput="textareaInput"
                                v-model="post.content"
                                placeholder="Bạn đang nghĩ gì?"
                                cols="30"
                                rows="4"
                                class="w-full bg-black border-0 mt-2 focus:ring-0 text-white text-[19px] font-medium min-h-[120px] focus:outline-none"
                            ></textarea>
                        </div>
                    </div>

                    <div class="w-full">
                        <video controls v-if="uploadType === 'mp4'" :src="showUpload" class="rounded-xl overflow-auto" />
                        <img v-else :src="showUpload" class="rounded-xl min-w-full" />
                    </div>
                    <div class="flex py-2 items-center text-[#1C9CEF] font-normal">
                        <i :class="status.find((item) => item.state === post.status).icon" class="pr-2"> </i>
                        {{ status.find((item) => item.state === post.status).description }}
                    </div>
                    <div class="border-b border-b-gray-700"></div>
                    <div class="flex items-center justify-between py-4">
                        <div class="flex items-center">
                            <div class="hover:bg-gray-800 inline-block p-2 rounded-full cursor-pointer mr-1 w-10 h-10">
                                <label for="fileUpload" class="cursor-pointer">
                                    <ImageOutline fillColor="#1C9CEF" :size="25" />
                                </label>
                                <input type="file" id="fileUpload" class="hidden" @change="getFile" />
                            </div>
                            <div class="hover:bg-gray-800 inline-block p-2 rounded-full cursor-pointer mr-1 w-10 h-10">
                                <FileGifBox fillColor="#1C9CEF" :size="25" />
                            </div>
                            <div class="hover:bg-gray-800 inline-block p-2 rounded-full cursor-pointer mr-1 w-10 h-10">
                                <Emoticon fillColor="#1C9CEF" :size="25" />
                            </div>
                        </div>
                        <button
                            :class="canPost ? 'bg-[#1C9CEF] text-white hover:bg-[#124D77]' : 'bg-[#124D77] text-gray-400 '"
                            :disabled="!canPost"
                            @click="addPost()"
                            class="hidden md:block font-bold text-[16px] p-1.5 pl-6 pr-6 px-4 rounded-full cursor-unset"
                        >
                            Tạo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.content {
    height: 30vh;
    overflow-y: auto;
    scrollbar-width: none;
}

.close-icon {
    &:hover {
        background-color: rgb(114, 151, 175) !important;
    }
}
</style>
