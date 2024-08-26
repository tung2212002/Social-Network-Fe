import { defineStore } from 'pinia';

export const useDialogStore = defineStore('dialog', {
    state: () => ({
        dialog: false,
        title: '',
        content: '',
        agreeText: '',
        disagreeText: '',
        agreeFunc: null,
        disagreeFunc: null,
        data: null,
    }),
    getters: {
        getDialog: (state) => state.dialog,
        getTitle: (state) => state.title,
        getContent: (state) => state.content,
        getAgreeText: (state) => state.agreeText,
        getDisagreeText: (state) => state.disagreeText,
        getDialogInfo: (state) => ({
            dialog: state.dialog,
            title: state.title,
            content: state.content,
            agreeText: state.agreeText,
            disagreeText: state.disagreeText,
            agreeFunc: state.agreeFunc,
            disagreeFunc: state.disagreeFunc,
            data: state.data,
        }),
    },
    actions: {
        show(title, content, agreeText, disagreeText, agreeFunc, disagreeFunc, data) {
            this.dialog = true;
            this.title = title;
            this.content = content;
            this.agreeText = agreeText;
            this.disagreeText = disagreeText;
            this.agreeFunc = agreeFunc;
            this.disagreeFunc = disagreeFunc;
            this.data = data;
        },
        hidden() {
            this.dialog = false;
            this.title = '';
            this.content = '';
            this.agreeText = '';
            this.disagreeText = '';
            this.agreeFunc = null;
            this.disagreeFunc = null;
            this.data = null;
        },
    },
});
