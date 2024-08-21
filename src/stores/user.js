import { defineStore } from 'pinia';
import { verifyTokenService } from '@/services/user/authService';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        loading: false,
    }),
    getters: {
        isAuthenticated: (state) => !!state.accessToken,
        getUser: (state) => state.user,
    },
    actions: {
        setUser(user) {
            this.user = user;
        },
        setAccessToken(token) {
            this.accessToken = token;
        },
        setRefreshToken(token) {
            this.refreshToken = token;
        },
        setToken(accessToken, refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        },
        setFullUser(user, accessToken, refreshToken) {
            console.log(user);
            this.user = user;
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            console.log(this.user);
            console.log(this.accessToken);
            console.log(this.refreshToken);
        },
        clearUser() {
            this.user = null;
            this.accessToken = null;
            this.refreshToken = null;
        },
        async fetchUser() {
            this.loading = true;
            try {
                const res = await verifyTokenService();
                if (res.status === 200) {
                    this.user = res.data.data;
                } else {
                    console.log('Failed to verify token', res.status);
                    this.clearUser(); // Clear user data if token verification fails
                }
            } catch (error) {
                console.log('Error during token verification', error);
                this.clearUser(); // Clear user data on error
            } finally {
                this.loading = false; // Set loading to false when done
            }
        },
    },
});
