import { defineStore } from 'pinia';

export const useCreaPostStore = defineStore('creaPost', {
    state: () => ({
        open: false,
    }),
    getters: {
        getOpen: (state) => state.open,
    },
    actions: {
        show() {
            this.open = true;
        },
        hidden() {
            this.open = false;
        },
    },
});
