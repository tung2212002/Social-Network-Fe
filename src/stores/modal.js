import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
    state: () => ({
        modal: false,
        tagUser: [],
    }),
    getters: {
        getModal: (state) => state.modal,
        getTagUser: (state) => state.tagUser,
    },
    actions: {
        show(tagUser) {
            this.modal = true;
            this.tagUser = tagUser;
        },
        hidden() {
            this.modal = false;
            this.tagUser = [];
        },
    },
});
