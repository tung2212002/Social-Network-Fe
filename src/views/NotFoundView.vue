<script setup>
import TagUserPostComponent2 from '@/components/TagUserPostComponent2.vue';
import { ref, defineProps, watch, defineEmits } from 'vue';

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

const emit = defineEmits();

function handleClick() {
    emit('custom-event', 'Hello from child!');
}
</script>

<template>
    not found
    <TagUserPostComponent2 />
    <TagUserPostComponent2 />
    <TagUserPostComponent2 />
    <TagUserPostComponent2 />
    <TagUserPostComponent2 />
    <TagUserPostComponent2 />
</template>
