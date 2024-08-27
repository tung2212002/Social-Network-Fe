<script setup>
import { getUserService } from '@/services/user/userService';
import { usePostStore, useUserStore } from '@/stores';
import { computed, onBeforeUnmount } from 'vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue';
import { SuggestFriendComponent } from '@/components';
import { getFriendListService, getSuggestFriendService } from '@/services/friend/friendService';
import { reactive } from 'vue';
import { icons } from '@/assets';
import { getListPostByUserIdService } from '@/services/post/postService';
import ContentMineComponent from '@/components/ContentMineComponent.vue';
import TweetComponent from '@/components/TweetComponent.vue';

const userStore = useUserStore();
const user = computed(() => userStore.getUser);
const profileUser = ref(null);
const router = useRouter();
let userId = router.currentRoute.value.params.id;
onMounted(() => {
    if (!userId) {
        userId = userStore.getUser.userId;
    }
    getUserService(userId)
        .then((res) => {
            // user.value = res.data.data;
            // console.log(user.value);
            if (res.status === 200) {
                console.log('res.data.data', res.data.data);
                profileUser.value = res.data.data;
                console.log(profileUser.value);
                console.log('profileUser---------', profileUser);
            }
        })
        .catch((err) => {
            console.log(err);
        });
});
const status = [
    {
        value: 'REQUESTED',
        label: 'Đã gửi yêu cầu',
    },
    {
        value: 'PENDING',
        label: 'Chờ xác nhận',
    },
    {
        value: 'CLOSE_FRIEND',
        label: 'Bạn bè',
    },
    {
        value: 'SIBLING',
        label: 'Anh chị em',
    },
    {
        value: 'PARENT',
        label: 'Bố mẹ',
    },
    {
        value: 'OTHER',
        label: 'Khác',
    },
    {
        value: 'BLOCK',
        label: 'Chặn',
    },
    {
        value: null,
        label: '',
    },
];

const gender = [
    {
        value: 'MALE',
        label: 'Nam',
    },
    {
        value: 'FEMALE',
        label: 'Nữ',
    },
    {
        value: 'OTHER',
        label: 'Khác',
    },
    {
        value: null,
        label: '',
    },
];

const state = reactive({
    friends: {
        users: [],
        page: 0,
        size: 5,
        isLoading: true,
        hasMore: true,
    },
});

const stateFriends = reactive({
    friends: {
        users: [],
        page: 0,
        size: 5,
        isLoading: true,
        hasMore: true,
        count: 0,
    },
});

const statePost = reactive({
    posts: {
        page: 0,
        size: 10,
        hasMore: true,
        firstLoad: true,
    },
});

const isLoading = computed(() => postStore.getIsLoadingMinePost);
const postStore = usePostStore();
const posts = computed(() => postStore.getMinePost);

const handleGetListPost = () => {
    console.log('handleGetListPost', isLoading.value, statePost.posts.hasMore);
    if (isLoading.value || !statePost.posts.hasMore) {
        return;
    }
    console.log('handleGetListPost--------');
    postStore.setIsLoadingMinePost(true);
    const params = {
        page: statePost.posts.page,
        size: statePost.posts.size,
    };

    getListPostByUserIdService(userId, params)
        .then((res) => {
            if (res.status === 200) {
                const newPosts = res.data.data;
                if (newPosts.length < statePost.posts.size) {
                    statePost.posts.hasMore = false;
                    console.log('No more post');
                }
                postStore.addListMinePost(newPosts);
                statePost.posts.page += 1;
            } else if (res.status === 403) {
                router.push('/not-found');
            }
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            postStore.setIsLoadingMinePost(false);
            if (statePost.posts.firstLoad) {
                statePost.posts.firstLoad = false;
            }
        });
};

const handleScroll = () => {
    const contentContainer = document.getElementById('content-home-view');
    if (contentContainer) {
        const bottomOfWindow = contentContainer.scrollTop + contentContainer.clientHeight >= contentContainer.scrollHeight;

        if (bottomOfWindow) {
            handleGetListPost();
        }
    }
};

onMounted(() => {
    const contentContainer = document.getElementById('content-mine-view');
    console.log('contentContainer', contentContainer);
    if (contentContainer) {
        contentContainer.addEventListener('scroll', handleScroll);
        handleGetListPost();
    }
});

onBeforeUnmount(() => {
    const contentContainer = document.getElementById('content-mine-view');
    if (contentContainer) {
        contentContainer.removeEventListener('scroll', handleScroll);
    }
});

onMounted(() => {
    handleGetListPost();
});

onMounted(() => {
    const params = {
        page: stateFriends.friends.page,
        size: stateFriends.friends.size,
    };
});

onMounted(() => {
    const params = {
        page: stateFriends.friends.page,
        size: stateFriends.friends.size,
    };

    getFriendListService(params)
        .then((res) => {
            if (res.status === 200) {
                const newListFriend = res.data.data.friendshipUsers;
                if (newListFriend.length < stateFriends.friends.size) {
                    stateFriends.friends.hasMore = false;
                }

                stateFriends.friends.users.push(...newListFriend);
                stateFriends.friends.count = res.data.data.friendQuantity;
                stateFriends.friends.page += 1;
            }
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            stateFriends.friends.isLoading = false;
        });
});
</script>

<template>
    <div class="flex full-content lg:w-7/12 w-11/12 border-x border-gray-800 relative scroll-container">
        <div class="w-full profile-top">
            <header>
                <div class="profile-header">
                    <div class="profile-header-background">
                        <img :src="profileUser?.background || 'https://picsum.photos/200/300'" alt="background" />
                    </div>
                    <div class="profile-header-avatar">
                        <img :src="profileUser?.avatar || icons.defaultAvatar" alt="avatar" />
                    </div>
                    <div class="profile-header-info">
                        <div class="profile-header-info-name">{{ profileUser?.firstName }} {{ profileUser?.lastName }}</div>
                        <div class="profile-header-info-username">
                            {{ profileUser?.firstName }}
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div class="profile-main">
                    <div class="profile-main-left">
                        <div class="profile-main-left-info">
                            <div class="profile-main-left-info-item">
                                <div class="profile-main-left-info-item-title" v-if="profileUser?.userEmail">Email</div>
                                <div class="profile-main-left-info-item-content">{{ profileUser?.userEmail }}</div>
                            </div>
                            <div class="profile-main-left-info-item">
                                <div class="profile-main-left-info-item-title" v-if="profileUser?.dob">Ngày sinh</div>
                                <div class="profile-main-left-info-item-content">{{ profileUser?.dob.value }}</div>
                            </div>
                            <div class="profile-main-left-info-item">
                                <div class="profile-main-left-info-item-title" v-if="profileUser?.phoneNumber">Số điện thoại</div>
                                <div class="profile-main-left-info-item-content" v-if="profileUser?.phoneNumber">
                                    {{ profileUser?.phoneNumber.value }}
                                </div>
                            </div>
                            <div class="profile-main-left-info-item">
                                <div class="profile-main-left-info-item-title" v-if="profileUser?.homeTown">Quê quán</div>
                                <div class="profile-main-left-info-item-content">{{ profileUser?.homeTown.value }}</div>
                            </div>
                            <div class="profile-main-left-info-item">
                                <div class="profile-main-left-info-item-title" v-if="profileUser?.schoolName">Trường học</div>
                                <div class="profile-main-left-info-item-content">{{ profileUser?.schoolName.value }}</div>
                            </div>
                            <div class="profile-main-left-info-item">
                                <div class="profile-main-left-info-item-title" v-if="profileUser?.workPlace">Nơi làm việc</div>
                                <div class="profile-main-left-info-item-content" v-if="profileUser?.workPlace">
                                    {{ profileUser?.workPlace.value }}
                                </div>
                            </div>
                            <div class="profile-main-left-info-item" v-if="profileUser?.gender">
                                <div class="profile-main-left-info-item-title">Giới tính</div>
                                <div class="profile-main-left-info-item-content">
                                    {{ gender.find((item) => item.value === profileUser?.gender.value).label }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="profile-main-right">
                        <div class="profile-main-right-friend">
                            <div class="profile-main-right-friend-title">
                                Bạn bè
                                <span class="font-weight-bold"> {{ stateFriends.friends.count }} </span>
                                <span> {{ ' ' }}</span
                                >người
                            </div>
                            <div class="profile-main-right-friend-list">
                                <template v-for="(friend, index) in stateFriends.friends.users" :key="index">
                                    <div class="profile-main-right-friend-item">
                                        <img :src="friend.user.avatar || icons.defaultAvatar" alt="avatar" />
                                        <div class="profile-main-right-friend-item-info">
                                            <div class="profile-main-right-friend-item-info-name">{{ friend.user.firstName }} {{ friend.user.lastName }}</div>
                                            <div class="profile-main-right-friend-item-info-username" v-if="friend.mutualFriendsQuantity > 0">
                                                {{ friend.mutualFriendsQuantity }} bạn chung
                                            </div>
                                            <div class="profile-main-right-friend-item-info-status">
                                                {{ status.find((item) => item.value === friend.status).label }}
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <div class="profile-footer">
                    <div class="profile-footer-menu">
                        <div class="profile-footer-menu-item">
                            <a href="#">Bài viết</a>
                        </div>

                        <RouterLink class="profile-footer-menu-item" to="/friendship">
                            <a href="#">Bạn bè</a>
                        </RouterLink>
                    </div>
                </div>
            </footer>
        </div>

        <div class="w-full" id="content-mine-view">
            <div class="w-full top-0 z-0 post">
                <div class="flex" v-for="post in posts" :key="post.postId">
                    <TweetComponent :post="post" />
                </div>
                <div class="text-center text-white">
                    <v-skeleton-loader
                        v-for="index in isLoading && (statePost.posts.firstLoad ? 3 : 1)"
                        :key="index"
                        class="mx-auto mb-2"
                        style="border-radius: 10px"
                        elevation="12"
                        max-width="100%"
                        type="table-heading, list-item-two-line, image, table-tfoot"
                    ></v-skeleton-loader>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profile-top {
    margin-top: 2000px;
}

.full-content {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding-bottom: 100px;
}

.profile-header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 300px;
}

.scroll-container {
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
}

.post {
    margin: 10px 0;
}

.profile-header-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f0f2f5;
}

.profile-header-background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-header-avatar {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 1;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 5px solid #fff;
}

.profile-header-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-header-info {
    position: absolute;
    bottom: 0;
    left: 150px;
    margin-top: 50px;
    text-align: center;
    z-index: 10;
    color: #fff;
}

.profile-header-info-name {
    font-size: 30px;
    font-weight: 600;
}

.profile-header-info-username {
    font-size: 18px;
    color: #606770;
}

.profile-main {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.profile-main-left {
    width: 300px;
}

.profile-main-left-info {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.profile-main-left-info-item {
    margin-bottom: 20px;
}

.profile-main-left-info-item-title {
    font-size: 16px;
    font-weight: 600;
}

.profile-main-left-info-item-content {
    font-size: 14px;
    color: #606770;
}

.profile-main-right {
    margin-left: 20px;
    width: 300px;
}

.profile-main-right-friend {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.profile-main-right-friend-title {
    font-size: 16px;
    font-weight: 600;
}

.profile-main-right-friend-list {
    margin-top: 20px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
}

.profile-main-right-friend-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    flex-direction: row;
}

.profile-main-right-friend-item img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
}

.profile-main-right-friend-item-info-name {
    font-size: 16px;
    font-weight: 600;
}

.profile-main-right-friend-item-info-username {
    font-size: 14px;
    color: #606770;
}

.profile-footer {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-top: 20px;
}

.profile-footer-menu {
    display: flex;
    justify-content: center;
}

.profile-footer-menu-item {
    margin-right: 20px;
}

.profile-footer-menu-item a {
    font-size: 16px;
    font-weight: 600;
    color: #606770;
    text-decoration: none;
}

.profile-footer-menu-item a:hover {
    text-decoration: underline;
}

footer {
    margin-top: 20px;
}

.profile-footer {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.profile-footer-menu {
    display: flex;
    justify-content: center;
}

.profile-footer-menu-item {
    margin-right: 20px;
}

.profile-footer-menu-item a {
    font-size: 16px;
    font-weight: 600;
    color: #606770;
    text-decoration: none;
}

.profile-footer-menu-item a:hover {
    text-decoration: underline;
}
</style>
