<script setup>
import { icons } from '@/assets';
import { searchFriendService } from '@/services/friend/friendService';
import { searchUserService } from '@/services/user/userService';

async function searchMovies({ search }) {
    if (!search) return [];
    try {
        const params = {
            keyword: search,
        };
        const res = await searchUserService(params);
        if (res.status === 200) {
            const data = res.data.data;
            return data.map((result) => {
                return {
                    label: result.user.firstName + ' ' + result.user.lastName,
                    value: result.user.userEmail,
                    avatar: icons.defaultAvatar,
                };
            });
        }
    } catch (error) {
        console.error(error);
    }
    return [];
}
</script>

<template>
    <FormKit name="friends" type="taglist" placeholder="Nhập tên hoặc email bạn bè" :options="searchMovies" popover load-on-created :close-on-select="false">
    </FormKit>
</template>

<style scoped>
.formkit-option {
    display: flex;
    align-items: center;
    transform: translateX(16px) !important;
}
</style>
