<template>
    <Multiselect
        v-model="selectedUsers"
        id="tag-user-post"
        label="name"
        track-by="userId"
        placeholder="Nhập tên hoặc email bạn bè"
        open-direction="bottom"
        :options="users"
        :multiple="true"
        :searchable="true"
        :loading="isLoading"
        :internal-search="false"
        :clear-on-select="false"
        :close-on-select="false"
        :options-limit="300"
        :limit="10"
        :limit-text="limitText"
        :max-height="600"
        :show-no-results="true"
        :hide-selected="true"
        @search-change="asyncFind"
        :showNoOptions="false"
        :showNoResults="false"
    >
        <template #option="{ option }">
            <div class="custom__option">
                <img :src="option.avatar" alt="Avatar" class="custom__avatar" />
                <span>{{ option.name }}</span>
            </div>
        </template>
        <template #tag="{ option, remove }">
            <span class="custom__tag">
                <span class="custom__name">{{ option.name }}</span>
                <span class="custom__remove" @click="remove(option)">❌</span>
            </span>
        </template>
        <template #clear="props">
            <div class="multiselect__clear" v-if="selectedUsers.length" @mousedown.prevent.stop="clearAll(props.search)">
                <span> Xóa tất cả tag </span>
            </div>
        </template>
        <template v-if="noResults" #noResult>
            <span class="multiselect__noResult">
                <span role="img" aria-label="sad">😢</span>
                Không tìm thấy kết quả
            </span>
        </template>
    </Multiselect>
</template>

<script setup>
import { ref, watch } from 'vue';
import Multiselect from 'vue-multiselect';
import { icons } from '@/assets/index.js';
import { searchFriendService } from '@/services/friend/friendService';

const props = defineProps({
    selectedUsers: {
        type: Array,
        default: () => [],
    },
});
const selectedUsers = ref(props.selectedUsers);

const emit = defineEmits(['update:selectedUsers']);

watch(selectedUsers, (value) => {
    emit('update:selectedUsers', value);
});

const users = ref([]);
const isLoading = ref(false);
const noResults = ref(false);

const limitText = (count) => `Và ${count} người bạn khác`;
const consoleloglistuser = () => {
    console.log(selectedUsers.value);
};
const asyncFind = async (query) => {
    isLoading.value = true;
    try {
        const res = await searchFriendService({ keyword: query });
        if (res.status === 200) {
            users.value = res.data.data.map((result) => ({
                name: `${result.firstName} ${result.lastName}`,
                userId: result.userId,
                avatar: result.avatar || icons.defaultAvatar,
            }));
            if (users.value.length === 0) {
                noResults.value = true;
            } else {
                noResults.value = false;
            }
        } else if (res.status === 404) {
            noResults.value = true;
        }
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

const clearAll = () => {
    consoleloglistuser();
    selectedUsers.value = [];
};
</script>

<style>
.multiselect__tags-wrap {
    display: flex !important;
    flex-wrap: wrap;
}

.multiselect--active {
    position: relative;
}

.multiselect__content-wrapper {
    position: absolute;
    top: 0;
    left: calc(100% + 10px);
    width: 100%;
    z-index: 100;
    background-color: #fff;
    transform: translateX(-10px);
    border-radius: 8px;
}

.multiselect {
    width: 400px;
    border: 2px solid #4a90e2; /* Đổi viền thành màu xanh sáng */
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #ffffff;
    padding: 6px;
    transition:
        box-shadow 0.3s ease,
        border-color 0.3s ease;
    transform: translateY(-50px);
}

.multiselect:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    border-color: #357abd; /* Màu viền khi hover */
}

.multiselect__placeholder {
    color: #999;
}

/* Định dạng cho các tùy chọn trong danh sách */
.custom__option {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    transition:
        background-color 0.3s ease,
        transform 0.3s ease;
    cursor: pointer;
    overflow: hidden;
}

.custom__option:hover {
    background-color: #e0f7fa; /* Màu nền khi hover */
    transform: scale(1.02); /* Tăng nhẹ kích thước khi hover */
}

.custom__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
    border: 2px solid #4a90e2; /* Viền cho avatar */
}

.custom__name {
    font-size: 12px;
    width: 70%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Định dạng cho các tag đã chọn */
.custom__tag-container {
    display: flex;
    flex-wrap: wrap; /* Cho phép các tag xuống dòng nếu không đủ chỗ */
    gap: 6px; /* Khoảng cách giữa các tag */
}

.custom__tag {
    display: flex;
    align-items: center;
    background-color: #f1f8ff;
    border-radius: 20px;
    padding: 3px 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    white-space: nowrap; /* Ngăn không cho nội dung bị xuống dòng */
    overflow: hidden;
    text-overflow: ellipsis; /* Hiển thị "..." nếu nội dung quá dài */
    width: fit-content;
}

.custom__tag:hover {
    background-color: #e0f0ff;
}

.custom__tag .custom__avatar {
    width: 20px;
    height: 20px;
    margin: 0 2px;
}

.custom__remove {
    font-size: 12px;
    cursor: pointer;
    margin-left: 8px;
    color: #d9534f; /* Màu đỏ cho nút xóa */
    transition: color 0.3s ease;
}

.custom__remove:hover {
    color: #c9302c; /* Màu đỏ đậm khi hover */
}

.multiselect__clear {
    cursor: pointer;
    border-radius: 10px;
    height: 28px;
    width: fit-content;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
}

.multiselect__clear:hover {
    background-color: #357abd; /* Màu xanh đậm khi hover */
}

/* Định dạng cho thông báo không có kết quả */

.multiselect__noResult {
    display: block;
    color: #9e9e9e;
    font-style: italic;
}

/* Định dạng cho phần hiển thị chọn lựa đã chọn */
.language-json {
    margin-top: 20px;
    padding: 12px;
    background-color: #f7f9fc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Courier New', Courier, monospace;
}

.multiselect__noResult {
    padding-top: 50px;
    color: #9e9e9e;
    font-style: italic;
}
</style>
