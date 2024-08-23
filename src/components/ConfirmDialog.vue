<script setup>
import { ref } from 'vue';

const props = defineProps({
    agreeFunc: Function,
    disagreeFunc: Function,
    title: String,
    content: String,
    agreeText: String,
    disagreeText: String,
});

const show = ref(true);
const { agreeFunc, disagreeFunc, title, content, agreeText, disagreeText } = props;
</script>

<template>
    <div class="text-center pa-4">
        <v-dialog v-model="show" max-width="300" persistent>
            <v-card class="card" :text="content" :title="title">
                <template v-slot:actions>
                    <div class="container-btn">
                        <v-spacer></v-spacer>

                        <button @click="agreeFunc" class="btn btn-agree mb-4">
                            {{ agreeText }}
                        </button>

                        <button @click="disagreeFunc" class="btn btn-disagree">
                            {{ disagreeText }}
                        </button>
                    </div>
                </template>
            </v-card>
        </v-dialog>
    </div>
</template>

<style scoped>
.container-btn {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.btn-agree {
    border-radius: 24px;
    background-color: rgb(253, 173, 25);
    color: white;
    border: none;
    width: 100%;
    padding: 10px 0;

    &:hover {
        background-color: rgb(248, 197, 121) !important;
    }
}

.btn-disagree {
    border-radius: 24px;
    background-color: black; /* Nút dưới có màu đen */
    color: white;
    border: 2px solid #fff;
    width: 100%;
    padding: 10px 0;

    &:hover {
        background-color: rgb(53, 53, 53) !important;
        border: 2px solid #fff;
    }
}
.card {
    background-color: black;
    border-radius: 20px !important;
    padding: 20px;
}
</style>
