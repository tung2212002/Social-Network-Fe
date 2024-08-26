<template>
    <v-card class="container">
        <v-toolbar color="primary" title="Quan hệ"> </v-toolbar>

        <div class="d-flex flex-row">
            <v-tabs v-model="tab" color="primary" direction="vertical">
                <v-tab v-for="item in list" :key="item.value" :value="item.value">
                    {{ item.title }}
                </v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="option-1">
                    <v-card flat>
                        <v-card-text>
                            <ListFriendComponent />
                        </v-card-text>
                    </v-card>
                </v-tabs-window-item>

                <v-tabs-window-item value="option-2">
                    <v-card flat>
                        <v-card-text>
                            <ListPendingFriendComponent />
                        </v-card-text>
                    </v-card>
                </v-tabs-window-item>

                <v-tabs-window-item value="option-3">
                    <v-card flat>
                        <v-card-text>
                            <ListRequestedFriendComponent />
                        </v-card-text>
                    </v-card>
                </v-tabs-window-item>
                <v-tabs-window-item value="option-4">
                    <v-card flat>
                        <v-card-text>
                            <ListBlockComponent />
                        </v-card-text>
                    </v-card>
                </v-tabs-window-item>
            </v-tabs-window>
        </div>
    </v-card>
</template>
<script setup>
import { ref } from 'vue';
import ListFriendComponent from './ListFriendComponent.vue';
import ListPendingFriendComponent from './ListPendingFriendComponent.vue';
import ListRequestedFriendComponent from './ListRequestedFriendComponent.vue';
import ListBlockComponent from './ListBlockComponent.vue';

// export default {
//   data: () => ({
//     tab: 'option-1',
//   }),
// }
const list = [
    { title: 'Danh sách bạn bè', value: 'option-1' },
    { title: 'Lời mời kết bạn', value: 'option-2' },
    { title: 'Yêu cầu kết bạn', value: 'option-3' },
    { title: 'Danh sách chặn', value: 'option-4' },
];
const tab = ref(list[0].value);
</script>

<style scoped>
.container {
    width: 100%;
}
</style>
