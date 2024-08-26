import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        loading: false,
        dialog: false,
        modalTag: false,
    }),
    getters: {
        getLoading: (state) => state.loading,
        getDialog: (state) => state.dialog,
        getModalTag: (state) => state.modalTag,
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
        showModalTag() {
            this.modalTag = true;
        },
        hiddenModalTag() {
            this.modalTag = false;
        },
    },
});
