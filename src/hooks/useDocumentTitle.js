import { onMounted, watch } from 'vue';

export function useDocumentTitle(title) {
    onMounted(() => {
        if (title.value) {
            document.title = title.value;
        } else {
            document.title = 'Cà khịa Social';
        }
    });

    watch(title, (newTitle) => {
        if (newTitle) {
            document.title = newTitle;
        } else {
            document.title = 'Cà khịa Social';
        }
    });
}
