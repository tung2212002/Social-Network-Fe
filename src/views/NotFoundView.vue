<script setup>
import TagUserPostComponent2 from '@/components/TagUserPostComponent2.vue';
import { ref, defineProps, watch, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

// Define the props
const props = defineProps({
    otp: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        default: '',
    },
    active: {
        type: Boolean,
        default: false,
    },
});

// Create a local reactive state for otp
const localOtp = ref(props.otp);

// Watch for changes in the prop and update localOtp
watch(
    () => props.otp,
    (newOtp) => {
        localOtp.value = newOtp;
    },
);

// Function to handle resend action
function handleResend() {
    localOtp.value = '';
}

const router = useRouter();
const handleBackToHome = () => {
    router.push('/');
};
</script>

<template>
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100%">
        Không tìm thấy trang
        <button
            @click="handleBackToHome"
            style="margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer"
        >
            Quay lại trang chủ
        </button>
    </div>
</template>
