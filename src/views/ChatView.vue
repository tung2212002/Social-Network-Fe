<script setup>
import { ref, computed, onMounted, inject, watch, nextTick } from 'vue';
import { groupService } from '@/services/chat/groupService';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { searchService, searchFriendService } from '@/services/chat/searchService';
import ChatSideBarItem from '../components/ChatSideBarComponet.vue';
import ChatDetailComponent from '../components/ChatDetailComponent.vue';
import { useUserStore } from '@/stores';

const toast = useToast();
const chats = ref([
    {
        groupId: '1_2',
        groupName: 'Bá Cao Hướng',
        groupType: 'PERSONAL',
        lastMessage: 'hello Hướng CHó',
        groupBackground: null,
        lastActive: null,
        messageUnreadCount: null,
        inGroup: false,
        online: false,
    },
]);
const isLoading = ref(true);
const firstLoading = ref(true);

const wsClient = inject('wsClient');
const selectedChat = ref(null);
const searchQuery = ref('');
const showCreateGroupDialog = ref(false);
const newGroupName = ref('');
const newGroupType = ref('GROUP_PUBLIC');
const searchMember = ref('');
const allUsers = ref([]);
const userStorage = useUserStore();
const currentUserId = userStorage.getUser.userId;
const selectedMembers = ref([]);
const filteredUsers = ref([]);

const subscribeToWebSocket = () => {
    if (wsClient.value && wsClient.value.active) {
        wsClient.value.subscribe(`/channel/app/${currentUserId}`, () => {
            fetchGroups();
        });
    }
};

const truncateMessage = (message, size) => {
    return message.length > size ? message.slice(0, size) + '...' : message;
};

const fetchGroups = async () => {
    try {
        const res = await groupService();
        if (res.status === 200) {
            const datas = res.data.data;

            if (Array.isArray(datas)) {
                chats.value = datas.map((data) => ({
                    groupId: data.groupId,
                    groupName: data.groupName,
                    groupType: data.groupType,
                    lastMessage: truncateMessage(data.lastMessage || '', 26),
                    groupBackground: data.groupBackground || 'https://cdn-icons-png.flaticon.com/512/69/69589.png',
                    lastMsgTime: data.lastMessageTime,
                    lastActive: data.lastActive,
                    messageUnreadCount: data.messageUnreadCount,
                    online: data.online,
                    inGroup: data.inGroup,
                }));
                console.log(chats.value);
                // .sort((a, b) => new Date(b.lastMsgTime) - new Date(a.lastMsgTime)); // Sort in descending order by lastMsgTime
            } else {
                console.error('Expected an array but got', datas);
            }
        } else {
            toast.error('Failed to fetch groups', { timeout: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.error('An error occurred', { timeout: 3000 });
    } finally {
        isLoading.value = false;
        console.log('isLoading complete', chats.value);
    }
};

onMounted(fetchGroups);

const filteredChats = computed(() => {
    return chats.value.filter((chat) => chat.groupName.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const search = async (query) => {
    if (query.trim()) {
        try {
            const response = await searchFriendService(query);
            console.log(response.data);
            chats.value = response.data;
        } catch (error) {
            toast.error('Không thể tìm kiếm người dùng', { timeout: 3000 });
        }
    } else {
        chats.value = [];
    }
};

watch(searchQuery, (newValue) => {
    search(newValue);
});

search('');

const selectChat = (groupId) => {
    selectedChat.value = chats.value.find((chat) => chat.groupId === groupId);
};

const createGroup = async () => {
    if (newGroupName.value.trim()) {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/groups', {
                groupName: newGroupName.value,
                groupType: newGroupType.value,
                members: selectedMembers.value,
            });

            if (response.status === 200 || response.status === 201) {
                const newGroup = response.data;
                chats.value.push({
                    groupId: newGroup.groupId,
                    groupName: newGroup.groupName,
                    lastMessage: null,
                    groupBackground: null,
                    lastActive: new Date().toISOString(),
                    messageUnreadCount: 0,
                    online: false,
                });
                toast.success('Nhóm đã được tạo thành công', { timeout: 3000 });
                newGroupName.value = '';
                newGroupType.value = 'GROUP_PUBLIC';
                selectedMembers.value = [];
                showCreateGroupDialog.value = false;
            } else {
                toast.error('Không thể tạo nhóm', { timeout: 3000 });
            }
        } catch (error) {
            console.error('Error creating group:', error);
            toast.error('Đã xảy ra lỗi khi tạo nhóm', { timeout: 3000 });
        }
    }
};

const fetchUsers = async () => {
    // try {
    //   const response = await axios.get('http://localhost:8080/api/v1/users');
    //   allUsers.value = response.data;
    // } catch (error) {
    //   console.error('Error fetching users:', error);
    //   toast.error('Không thể tải danh sách người dùng', { timeout: 3000 });
    // }
};

// const filteredUsers = computed(() => {
//   // return allUsers.value.filter(user =>
//   //   user.username.toLowerCase().includes(searchMember.value.toLowerCase())
//   // );
// });

const toggleMember = (userId) => {
    const index = selectedMembers.value.indexOf(userId);
    if (index === -1) {
        selectedMembers.value.push(userId);
    } else {
        selectedMembers.value.splice(index, 1);
    }
};

onMounted(() => {
    nextTick(() => {
        subscribeToWebSocket();
    });
});

watch(searchMember, async (newValue) => {
    if (newValue.trim()) {
        try {
            const response = await searchService(newValue);
            allUsers.value = response.data;
        } catch (error) {
            toast.error('Không thể tìm kiếm người dùng', { timeout: 3000 });
        }
    } else {
        allUsers.value = [];
    }
});
</script>

<template>
    <div class="chat-layout">
        <div class="group">
            <div class="search-bar">
                <input type="text" v-model="searchQuery" placeholder="Tìm kiếm cuộc trò chuyện..." />
            </div>
            <div v-if="isLoading">Loading...</div>
            <template v-else>
                <ChatSideBarItem
                    v-for="chat in filteredChats"
                    :key="chat.groupId"
                    :groupId="chat.groupId"
                    :groupName="chat.groupName"
                    :lastMessage="chat.lastMessage"
                    :groupBackground="chat.groupBackground"
                    :lastActive="chat.lastActive"
                    :messageUnreadCount="chat.messageUnreadCount"
                    :online="chat.online"
                    @click="selectChat(chat.groupId)"
                />
            </template>
            <div
                class="create-group-button"
                @click="
                    showCreateGroupDialog = true;
                    fetchUsers();
                "
            >
                <span class="plus-icon">+</span>
            </div>
        </div>
        <div class="chat">
            <template v-if="selectedChat">
                <ChatDetailComponent :chat="selectedChat" />
            </template>
            <template v-else>
                <p>Vui lòng chọn một cuộc trò chuyện</p>
            </template>
        </div>
        <div v-if="showCreateGroupDialog" class="create-group-dialog">
            <h3>Tạo nhóm mới</h3>
            <input v-model="newGroupName" placeholder="Nhập tên nhóm" />
            <select v-model="newGroupType">
                <option value="GROUP_PUBLIC">Công khai</option>
                <option value="GROUP_PRIVATE">Riêng tư</option>
            </select>
            <input v-model="searchMember" placeholder="Tìm kiếm thành viên" />
            <div class="member-list">
                <div v-for="user in filteredUsers" :key="user.id" @click="toggleMember(user.id)" :class="{ selected: selectedMembers.includes(user.id) }">
                    {{ user.username }}
                </div>
            </div>
            <button @click="createGroup">Tạo</button>
            <button @click="showCreateGroupDialog = false">Hủy</button>
        </div>
    </div>
</template>

<style scoped>
.chat-layout {
    display: flex;
    height: 100vh;
}

.group {
    width: 300px;
    overflow-y: auto;
    border-right: 1px solid #e0e0e0;
    position: relative;
}

.chat {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.search-bar {
    padding: 10px;
}

.search-bar input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 20px;
}

.create-group-button {
    position: absolute;
    bottom: 20px;
    left: 20px;
    width: 50px;
    height: 50px;
    background-color: #007bff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.plus-icon {
    color: white;
    font-size: 24px;
}

.create-group-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.create-group-dialog input {
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
}

.create-group-dialog button {
    margin-right: 10px;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.create-group-dialog button:last-child {
    background-color: #6c757d;
}

@media (max-width: 1023px) {
    .chat-layout {
        flex-direction: column;
    }

    .group {
        width: 100%;
        height: 50vh;
        border-right: none;
        border-bottom: 1px solid #e0e0e0;
    }

    .chat {
        height: 50vh;
    }
}

.create-group-dialog {
    width: 300px;
}

.create-group-dialog select,
.create-group-dialog input {
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
}

.member-list {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ccc;
    margin-bottom: 10px;
}

.member-list div {
    padding: 5px;
    cursor: pointer;
}

.member-list div:hover {
    background-color: #f0f0f0;
}

.member-list div.selected {
    background-color: #007bff;
    color: white;
}
</style>
