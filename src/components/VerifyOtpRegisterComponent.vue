<template>
    <v-dialog v-model="localActive" max-width="500" persistent>
        <v-card class="py-8 px-6 text-center mx-auto ma-4 align-center" elevation="12" max-width="400" width="100%">
            <h3 class="text-h6 mb-4">Xác minh tài khoản</h3>

            <div class="text-body-2">
                Chúng tôi đã gửi mã đến {{ localAccount.userEmail }} <br />

                Kiểm tra email của bạn và nhập mã bên dưới.
            </div>

            <v-sheet color="surface">
                <v-otp-input v-model="localAccount.otp" type="number" variant="solo"></v-otp-input>
            </v-sheet>

            <v-btn class="my-4" color="purple" height="40" text="Xác nhận" variant="flat" width="70%" @click.prevent="verifyOtp"></v-btn>

            <div class="text-caption">Bạn chưa nhận được mã? <a href="#" @click.prevent="resendCode">Gửi lại</a></div>
            <a href="#" @click.prevent="closeDialog">Thoát</a>
        </v-card>
    </v-dialog>
</template>

<script setup>
import route from '@/constants/route';
import { checkOptService, registerService } from '@/services/user/authService';
import { useLoadingStore } from '@/stores';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const regexOtp = /^\d{6}$/;
const toast = useToast();
const router = useRouter();
const useLoading = useLoadingStore();

const props = defineProps({
    active: Boolean,
    account: Object,
});

const emit = defineEmits(['update:active', 'update:account']);

const localActive = computed({
    get: () => props.active,
    set: (value) => emit('update:active', value),
});

const localAccount = computed({
    get: () => props.account,
    set: (value) => emit('update:account', value),
});

const closeDialog = () => {
    localActive.value = false;
};

const resendCode = () => {
    registerService(localAccount.value)
        .then((res) => {
            if (res.status === 200) {
                toast.success('OTP đã được gửi đến email của bạn', { timeout: 3000 });
            }
        })
        .catch((err) => {
            toast.error('Đã có lỗi xảy ra', { timeout: 3000 });
        });
};

const verifyOtp = () => {
    if (!localAccount.value.otp.trim() || !regexOtp.test(localAccount.value.otp.trim())) {
        toast.error('Hãy nhập kí tự đủ 6 số', { timeout: 3000 });
        return;
    }
    useLoading.show();
    checkOptService(localAccount.value)
        .then((res) => {
            if (res.status === 200) {
                toast.success('Đăng kí tài khoản thành công', { timeout: 3000 });
                router.push(route.HOMEPAGE);
                useLoading.hidden();
            } else if (res.status === 400) {
                toast.error('OTP không đúng hoặc đã hết hạn', { timeout: 3000 });
            } else if (res.status === 429) {
                toast.error('Quá số lần nhập OTP', { timeout: 3000 });
            }
        })
        .catch((error) => {
            toast.err('Đã có lỗi xảy ra', { timeout: 3000 });
        });
};
</script>
