import { defineStore } from 'pinia';

export const useCreaPostStore = defineStore('creaPost', {
    state: () => ({
        open: false,
        openUpdate: false,
        editPostId: null,
    }),
    getters: {
        getOpen: (state) => state.open,
        getOpenUpdate: (state) => state.openUpdate,
        getEditPostId: (state) => state.editPostId,
    },
    actions: {
        show() {
            this.open = true;
        },
        hidden() {
            this.open = false;
        },
        showUpdate(id) {
            this.openUpdate = true;
            this.editPostId = id;
        },
        hiddenUpdate() {
            this.openUpdate = false;
            this.editPostId = null;
        },
    },
});
