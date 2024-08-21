import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        loading: false,
    }),
    getters: {
        getLoading: (state) => state.loading,
    },
    actions: {
        show() {
            this.loading = true;
        },
        hidden() {
            this.loading = false;
        },
    },
});
