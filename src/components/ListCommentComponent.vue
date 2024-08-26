<template>
    <div class="text-center pa-4">
        <v-dialog v-model="dialog" max-width="600" persistent class="container">
            <v-card title="Bình luận" class="content" elevation="12">
                <v-btn @click="close" class="close" color="red" dark>X</v-btn>
            </v-card>
            <template v-if="!state.isLoading">
                <div class="w-full comments">
                    <div class="flex flex-col" v-for="comment in state.comment" :key="comment.commentId">
                        <CommentComponent :comment="comment" />
                    </div>
                </div>
            </template>
            <div class="input-container">
                <div class="hover:bg-gray-800 inline-block p-2 rounded-full cursor-pointer mr-1 w-10 h-10">
                    <label for="fileUpload" class="cursor-pointer">
                        <ImageOutline fillColor="#1C9CEF" :size="25" />
                    </label>
                    <input type="file" id="fileUpload" class="hidden" @change="getFile" />
                </div>
                <div class="flex-1 images-input">
                    <v-col class="relative" v-if="image.imageLocal" style="max-height: 100px">
                        <div
                            @click="removeImage()"
                            class="hover:bg-gray-800 inline-block rounded-full cursor-pointer absolute top-5 right-5 bg-black hover:bg-gray-800 z-10 p-1 close-icon"
                        >
                            <Close fillColor="#FFFFFF" :size="24" class="" />
                        </div>
                        <v-img :src="image.imageLocal" aspect-ratio="1" class="bg-grey-lighten-2 border-radius-10 rounded-xl image" cover style="max-height: 100px">
                            <template v-slot:placeholder>
                                <v-row align="center" class=" ma-0" justify="center">
                                    <v-progress-circular color="grey-lighten-5" indeterminate></v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>
                    </v-col>
                    <input type="text" placeholder="Nhập bình luận..." v-model="comment.content" class="mt-4 w-full" />
                </div>

                <v-btn @click="addComment" color="primary" class="mr-2" :disabled="!comment.content && !image.imageLocal">
                    <i class="ri-send-plane-fill"></i>
                </v-btn>
            </div>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, reactive } from 'vue';
import ImageOutline from 'vue-material-design-icons/ImageOutline.vue';
import { createCommentService, getListCommentByPostIdService, getListCommentChildByCommentIdService } from '@/services/post/commentService';
import { useRouter } from 'vue-router';
import CommentComponent from './CommentComponent.vue';
import { useToast } from 'vue-toastification';
import { upImageCommentService } from '@/services/post/imageService';
import Close from 'vue-material-design-icons/Close.vue';

const props = defineProps({
    postId: Number,
    openComment: Boolean,
});

const router = useRouter();
const dialog = ref(props.openComment);
const toast = useToast();
const postId = ref(props.postId);
const fileUpload = ref(null);
const image = ref({
    imageLocal: '',
    publicId: '',
});
const emit = defineEmits(['update:openComment']);

const comment = reactive({
    postId: postId.value,
    content: '',
    publicId: '',
});

const state = reactive({
    page: 0,
    size: 10,
    comment: [],
    isLoading: true,
});

watch(
    () => props.openComment,
    (newValue) => {
        dialog.value = newValue;
    },
);

watch(dialog, (newValue) => {
    emit('update:openComment', newValue);
});

const removeImage = (publicId) => {
    image.value.imageLocal = '';
    image.value.publicId = '';
};

const handleGetComment = () => {
    const params = {
        page: state.page,
        size: state.size,
    };
    getListCommentByPostIdService(postId.value, params)
        .then((res) => {
            if (res.status === 200) {
                state.comment = res.data.data;
            } else {
                console.error(res);
            }
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            state.isLoading = false;
        });
};

const close = () => {
    dialog.value = false;
};

const handleNavigateToProfile = (userId) => {
    router.push(`/profile/${userId}`);
};
const handleUploadImagePost = () => {
    const body = new FormData();
    body.append('image', fileUpload.value);
    upImageCommentService(body)
        .then((res) => {
            if (res.status === 200) {
                image.value.imageLocal = URL.createObjectURL(fileUpload.value);
                image.value.publicId = res.data.data.publicId;
                fileUpload.value = null;
            }
        })
        .catch((err) => {
            console.error(err);
        });
};

const addComment = () => {
    const body = {
        postId: comment.postId,
        content: comment.content,
        publicId: image.value.publicId,
    };
    createCommentService(body)
        .then((res) => {
            if (res.status === 200) {
                state.comment.unshift(res.data.data);
                comment.content = '';
                comment.publicId = '';
                image.value.imageLocal = '';
                image.value.publicId = '';
            } else if (res.status === 400) {
                toast.error('Hình như bài đăng hơi linh tinh :(((', { timeout: 3000 });
            }
        })
        .catch((err) => {
            console.error(err);
        });
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

onMounted(() => {
    handleGetComment();
});
</script>

<style>
.image[data-v-b232f265]{
    min-height: 50px !important;
}
</style>

<style scoped>
.container {
    color: white;
}

.comments {
    max-height: 500px;
    overflow-y: auto;
    background-color: rgb(37, 37, 37);
}

.avatar {
    border-radius: 50%;
    padding: 0 !important;
    border: none !important;

    &:hover {
        cursor: pointer;
    }
}

.full-name {
    font-weight: 500;
    font-size: 16px;
    color: #000;

    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
}

.content {
    position: relative;
    overflow: hidden;
    max-height: 500px;
    border-radius: 10px;
}

.close {
    position: absolute;
    top: 0 !important;
    right: 0 !important;
    color: white;
    background-color: rgb(37, 37, 37) !important;
    width: 30px;
    height: 30px;
    padding: 0 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    cursor: pointer;

    &:hover {
        background-color: rgb(107, 79, 79) !important;
    }
}

.input-container {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.input-container input[type='text'] {
    border: none;
    outline: none;
    flex: 1;
    padding: 10px;
    font-size: 16px;
    color: #333;
    background-color: transparent;
}

.input-container input[type='file'] {
    display: none;
}

.input-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #007bff;
    margin-right: 10px;
    font-size: 16px;
}

.input-label i {
    margin-right: 5px;
    font-size: 20px;
}

.input-label:hover {
    color: #0056b3;
}

.image-input {
    max-height: 200px;
}

.image {
    min-height: 200px;
}
</style>
