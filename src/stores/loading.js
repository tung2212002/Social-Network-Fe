import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        loading: false,
        dialog: false,
    }),
    getters: {
        getLoading: (state) => state.loading,
        getDialog: (state) => state.dialog,
    },
    actions: {
        show() {
            this.loading = true;
        },
        hidden() {
            this.loading = false;
        },
        showDialog() {
            this.dialog = true;
        },
        hiddenDialog() {
            this.dialog = false;
        },
    },
});
