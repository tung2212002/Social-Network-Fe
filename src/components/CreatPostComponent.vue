<template>
    <div class="flex p-4 items-start gap-4 border-b border-gray-700">
        <div class="avatar">
            <div class="w-8 rounded-full">
                <img :src="authUser.profileImg || '/avatar-placeholder.png'" />
            </div>
        </div>
        <form class="flex flex-col gap-2 w-full">
            <textarea
                class="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
                placeholder="What is happening?!"
                v-model="text"
            />
            <div v-if="img" class="relative w-72 mx-auto">
                <img :src="img" class="w-full mx-auto h-72 object-contain rounded" />
            </div>
            <div class="flex justify-between border-t py-2 border-t-gray-700">
                <div class="flex gap-1 items-center"></div>
                <input type="file" accept="image/*" hidden ref="imgRef" />
                <button class="btn btn-primary rounded-full btn-sm text-white px-4">
                    {{ isPending ? 'Posting...' : 'Post' }}
                </button>
            </div>
            <div v-if="isError" class="text-red-500">{{ error.message }}</div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
//   import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
//   import { CiImageOn } from 'vue-icons/cico'; // Import your Vue icon components
//   import { BsEmojiSmileFill } from 'vue-icons/bs';
//   import { IoCloseSharp } from 'vue-icons/io5';
import { verifyTokenService } from '@/services/user/authService';
import { useRouter } from 'vue-router';
import { toast } from 'vue-toastification'; // Use a Vue toast library

const text = ref('');
const img = ref(null);
const imgRef = ref(null);
//   const router = useRouter();
//   const queryClient = useQueryClient();

// Fetch authenticated user
//   const { data: authUser } = useQuery({
//     queryKey: ['authUser'],
//     queryFn: verifyTokenService,
//   });

//   const { mutate: createPost, isPending, isError, error } = useMutation({
//     mutationFn: async ({ text, img }) => {
//       try {
//         const res = await fetch('/api/posts/create', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ text, img }),
//         });
//         const data = await res.json();
//         if (!res.ok) {
//           throw new Error(data.error || 'Something went wrong');
//         }
//         return data;
//       } catch (error) {
//         throw new Error(error);
//       }
//     },
//     onSuccess: () => {
//       text.value = '';
//       img.value = null;
//       toast.success('Post created successfully');
//       queryClient.invalidateQueries(['posts']);
//     },
//   });

//   const handleSubmit = () => {
//     createPost({ text: text.value, img: img.value });
//   };

//   const handleImgChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         img.value = reader.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleImgRemove = () => {
//     img.value = null;
//     imgRef.value.value = null;
//   };

//   const triggerFileInput = () => {
//     imgRef.value.click();
//   };

//   // Handle any additional setup or watch changes if needed
//   onMounted(() => {
//     // Any additional setup logic can go here
//   });

//   watch([text, img], (newValues) => {
//     // Watch changes to text and img if needed
//   });
</script>

<style scoped>
/* Add your styles here */
</style>
