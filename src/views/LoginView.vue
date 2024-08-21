<!-- src/components/Login.vue -->
<template>
    <div class="container">
        <div class="header">
            <div class="logo">
                <i class="ri-twitter-x-fill"></i>
            </div>
        </div>

        <div class="content">
            <h1>Đăng nhập vào X</h1>

            <div class="sign_in_buttons">
                <button class="primary sign_in">
                    <object :data="icons.googleSVG"></object>
                    <span class="login_social_button">Đăng nhập bằng Google</span>
                </button>
                <button class="primary sign_in">
                    <object :data="icons.appleSVG"></object>
                    <span class="login_social_button">Đăng nhập bằng Apple</span>
                </button>
            </div>

            <div class="divider">
                <p>or</p>
            </div>

            <div class="email_label">
                <FormKit type="text" class="email_input" label="Username" id="log_in" v-model="state.userEmail" style="height: 50px" />
            </div>

            <div class="password_label">
                <InputPassword v-model:value="state.password" toggleMask class="custom-input-password" placeholder="Password" />
            </div>

            <div class="sign_up_buttons">
                <button class="primary sign_up" @click="handleLogin">Đăng nhập</button>
                <button class="secondary sign_up">Quên mật khẩu?</button>
            </div>
        </div>

        <div class="register">
            <p>Bạn chưa có tài khoản? <RouterLink :to="route.REGISTERPAGE">Đăng ký</RouterLink></p>
        </div>

        <!-- <Toast /> -->
    </div>
</template>

<script setup>
import { InputPassword } from 'ant-design-vue';
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';

import { loginService } from '@/services/user/authService';
import { setLocalToken } from '@/utils/authStorage/authLocalStorage';
import { icons } from '@/assets';
import { useLoadingStore, useUserStore } from '@/stores';
import { RouterLink, useRouter } from 'vue-router';
import route from '@/constants/route';

const toast = useToast();
const userStorage = useUserStore();
const loadingStore = useLoadingStore();
const router = useRouter();

const state = reactive({
    userEmail: '',
    password: '',
});

const handleLogin = () => {
    loadingStore.show();
    loginService(state)
        .then((res) => {
            if (res.status === 200) {
                const data = res.data.data;
                setLocalToken(data);
                userStorage.setFullUser(data.user, data.accessToken, data.refreshToken);
                router.push(route.HOMEPAGE);
            } else {
                toast.error('Tài khoản hoặc mật khẩu không hợp lệ', { timeout: 3000 });
            }
        })
        .catch((err) => {
            toast.error('Đã có lỗi xảy ra', { timeout: 3000 });
        })
        .finally(() => {
            loadingStore.hidden();
        });
};

const alert = reactive({
    dismissSecs: 10,
    dismissCountDown: 0,
    showDismissibleAlert: false,
});

const showDismissibleAlert = (message) => {
    alert.message = message;
    alert.showDismissibleAlert = true;
};
</script>

<style lang="scss" scoped>
button {
    border: none;
    background: none;
    font-family: inherit;
    color: inherit;
    cursor: pointer;
}

a {
    text-decoration: none;
    font-family: inherit;
    color: inherit;
}

.container {
    max-width: 600px;
    width: 100%;
    background-color: #000;
    padding: 30px 20px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.header {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.close_button {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 25px;
    padding: 8px;
    border-radius: 50%;
}

.close_button:hover {
}

.logo {
    font-size: 30px;
}

.content {
    width: 400px;
    text-align: center;
}

.content h1 {
    margin-block: 24px;
    font-size: 32px;
    font-weight: 700;
    color: #fff;
}

.sign_in_buttons {
    display: flex;
    flex-direction: column;
    gap: 1.3rem;
}

.primary,
.secondary {
    width: 100%;
    border-radius: 20px;
    padding: 8px 0;
    font-size: 15px;
    font-weight: 500;
    transition: 0.2s ease;
}

.primary {
    background-color: #fff;
    color: var(--black-color);
}

.primary:hover {
    background-color: var(--black-color);
    color: #fff;
}

.sign_in_buttons:hover .login_social_button {
    color: var(--white-color);
}

.secondary {
    background-color: transparent;
    color: #fff;
    border: 1px solid #536471;
}

.secondary:hover {
    background-color: var(--white-color);
}

.sign_in {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

object {
    max-width: 24px;
    max-height: 24px;
}

.divider {
    width: 100%;
    margin-block: 20px;
    position: relative;
}

.divider p::before,
.divider p::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background-color: #333639;
}

.divider p::before {
    left: 0;
}

.divider p::after {
    right: 0;
}

.email_label,
.password_label {
    width: 100%;
    position: relative;

    input {
        width: 100%;
        border-radius: 6px;
        background-color: transparent;
        border: 1px solid #333639;
        padding: 15px 10px 15px 10px;
        outline: none;
        color: #fff;
        font-size: 18px;
        font-family: inherit;
        height: 50px !important;
    }
}

.password_label {
    margin-top: 20px;
}

input::placeholder {
    opacity: 0;
}

input + label {
    position: absolute;
    top: 15px;
    left: 10px;
    color: #71767b;
    font-size: 18px;
    pointer-events: none;
    transition: 0.2s ease;
}

input:focus {
    outline: 1px solid var(--label-focus-color);
}

input:focus + label {
    color: var(--label-focus-color);
}

input:focus + label {
    top: 6px;
    left: 10px;
    font-size: 12px;
}

.sign_up,
.register {
    margin-top: 1.3rem;
}

.register {
    font-weight: 300px;
    font-size: 14px;
    color: #71767b;
}

.register a {
    color: var(--label-focus-color);
}

.register a:hover {
    text-decoration: underline;
}

.custom-input-password {
    height: 50px;
    font-size: 1.2em;
}
</style>
