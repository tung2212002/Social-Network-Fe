import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        accessToken: null,
        refreshToken: null,
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
        clearUser() {
            this.user = null;
            this.accessToken = null;
            this.refreshToken = null;
        },
        async fetchUser() {
            try {
                const response = await fetch('/api/v1/auth/verify-token');
                if (response.status === 200) {
                    const data = await response.json();
                    this.user = data.data;
                    this.valid = true;
                } else {
                    this.valid = false;
                }
            } catch (error) {
                console.error(error);
                this.valid = false;
            } finally {
                this.loading = false;
            }
        },
    },
});
