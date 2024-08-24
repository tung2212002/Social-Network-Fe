<script setup>
import { ref, onMounted, computed, watch, nextTick, inject } from 'vue';
import { getMessagesService } from '@/services/chat/messageService';
import { leaveGroupService } from '@/services/chat/groupService';
import { useToast } from 'vue-toastification';

const toast = useToast();
const isLoading = ref(true);

const props = defineProps({
  chat: {
    type: Object,
    required: true
  }
});

const messageList = ref([]);
const showOptions = ref(false);
const showMembers = ref(false);
const groupName = ref(props.chat.groupName);
const groupAvatar = ref(props.chat.groupBackground);
const isPublic = ref(true);
const members = ref([]);
const fileInput = ref(null);
const groupNameElement = ref(null);
const newMessage = ref('');
const wsClient = inject('wsClient');
const currentUserId = 9;

const fetchListMessages = async (groupId) => {
  try {
    const res = await getMessagesService(groupId);
    if (res.status === 200) {
      const data = res.data.data;
      if (data && Array.isArray(data.message)) {
        await nextTick(() => {
          messageList.value = data.message.map(msg => ({
            user: msg.msgReply?.user || {},
            msgId: msg.msgReply?.msgId || '',
            message: {
              content: msg.msgReply.message?.content || '',
              msgType: msg.msgReply.message?.msgType,
              createAt: msg.msgReply?.createAt || new Date().toISOString()
            },
            reactionQuantity: msg.msgReply?.reactionQuantity || 0,
            images: msg.msgReply?.images || []
          })).reverse(); // Add this reverse() method
        });
      } else {
        console.error("Mong đợi một mảng tin nhắn nhưng nhận được", data);
      }
    } else {
      toast.error('Không thể tải tin nhắn', { timeout: 3000 });
    }
  } catch (err) {
    console.error(err);
    toast.error('Đã xảy ra lỗi', { timeout: 3000 });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (props.chat?.groupId) {
    console.log(props.chat);
    fetchListMessages(props.chat.groupId);
    fetchGroupDetails();
    nextTick(() => {
      subscribeToWebSocket();
    });
  }
});

watch(
  () => props.chat,
  (newChat) => {
    if (newChat?.groupId) {
      console.log('Nhóm chat đã thay đổi:', newChat);
      fetchListMessages(newChat.groupId);
    }
  },
  { immediate: true, deep: true }
);

const updateGroupInfo = (newGroupInfo) => {
  groupName.value = newGroupInfo.groupName;
  groupAvatar.value = newGroupInfo.groupBackground;
};

const sendMessage = () => {
  if (newMessage.value.trim() && wsClient.value && wsClient.value.active) {
    const newMsg = {
      groupId: props.chat.groupId,
      groupType: props.chat.groupType,
      content: newMessage.value,
      msgType: "MESSAGE",
    }

    // Send the message through WebSocket
    wsClient.value.publish({
      destination: `/app/channel`,
      body: JSON.stringify(newMsg)
    });

    // Optimistically add the message to the local list
    messageList.value.push(newMsg);
    newMessage.value = '';
  } else if (!wsClient.value || !wsClient.value.active) {
    toast.error('WebSocket connection is not active. Please try again later.', { timeout: 3000 });
  }
};

const subscribeToWebSocket = () => {
  if (wsClient.value && wsClient.value.active) {
    wsClient.value.subscribe(`/channel/app/${currentUserId}`, (message) => {
      handleReceivedMessage(JSON.parse(message.body));
    });
  }
};

const handleReceivedMessage = (message) => {
  console.log(message.msgType);

  console.log(message.groupId === props.chat.groupId);

  if (message.groupId === props.chat.groupId) {
    this.messageList.value.push({
      msgId: message.id,
      user: message.user || { userId: message.userAuthId },
      message: {
        content: message.content,
        msgType: message.msgType,
        createAt: message.createAt
      },
      reactionQuantity: message.reactionQuantity || 0,
      images: message.images || []
    });
    console.log(this.message.value);

  }
};


const toggleOptions = () => {
  showOptions.value = !showOptions.value;
};

const selectImages = () => {
  console.log('Chọn ảnh');
};

const fetchGroupDetails = async () => {

  members.value = [
    { id: 1, name: 'Nguyễn Văn A', nickname: 'A', editingNickname: false },
    { id: 2, name: 'Trần Thị B', nickname: 'B', editingNickname: false },
  ];
};

const showMemberModal = ref(false);
const toggleMemberModal = () => {
  showMemberModal.value = !showMemberModal.value;
  showMembers.value = false;
};

// Add this new function
const toggleMembers = () => {
  showMembers.value = true;
  if (showMembers.value) {
    toggleMemberModal();
  }
};

const kickMember = (memberToKick) => {
  members.value = members.value.filter(member => member.id !== memberToKick.id);
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      groupAvatar.value = e.target.result;
      updateGroupAvatar(file);
    };
    reader.readAsDataURL(file);
  }
};

const updateGroupAvatar = async (file) => {
  // Giả lập gọi API để cập nhật ảnh đại diện
  try {
    // await updateGroupAvatarAPI(props.chat.groupId, file);
    toast.success('Đã cập nhật ảnh đại diện nhóm');
  } catch (error) {
    toast.error('Không thể cập nhật ảnh đại diện nhóm');
  }
};

const updateGroupName = () => {
  const newName = groupNameElement.value.innerText.trim();
  if (newName && newName !== groupName.value) {
    groupName.value = newName;
    // Giả lập gọi API để cập nhật tên nhóm
    // await updateGroupNameAPI(props.chat.groupId, newName);
    toast.success('Đã cập nhật tên nhóm');
  }
};

const toggleEditNickname = (member) => {
  member.editingNickname = !member.editingNickname;
};

const updateNickname = async (member) => {
  // Giả lập gọi API để cập nhật biệt danh
  try {
    // await updateMemberNicknameAPI(props.chat.groupId, member.id, member.nickname);
    member.editingNickname = false;
    toast.success('Đã cập nhật biệt danh');
  } catch (error) {
    toast.error('Không thể cập nhật biệt danh');
  }
};

const removeMember = async (member) => {
  if (confirm(`Bạn có chắc muốn xóa ${member.name} khỏi nhóm không?`)) {
    // Giả lập gọi API để xóa thành viên
    try {
      // await removeMemberAPI(props.chat.groupId, member.id);
      members.value = members.value.filter(m => m.id !== member.id);
      toast.success('Đã xóa thành viên');
    } catch (error) {
      toast.error('Không thể xóa thành viên');
    }
  }
};

const addMember = () => {
  const newMemberName = prompt('Nhập tên của thành viên mới:');
  if (newMemberName) {
    // Giả lập gọi API để thêm thành viên
    const newMember = {
      id: Date.now(),
      name: newMemberName,
      nickname: '',
      editingNickname: false
    };
    members.value.push(newMember);
    toast.success('Đã thêm thành viên mới');
  }
};

const updateGroupState = async () => {
  // Giả lập gọi API để cập nhật trạng thái nhóm
  try {
    // await updateGroupStateAPI(props.chat.groupId, isPublic.value);
    toast.success(`Nhóm hiện ${isPublic.value ? 'công khai' : 'riêng tư'}`);
  } catch (error) {
    toast.error('Không thể cập nhật trạng thái nhóm');
  }
};

const leaveGroup = async () => {
  console.log(props.chat.groupId);

  if (!props.chat?.groupId) {
    toast.error('Không tìm thấy ID nhóm', { timeout: 3000 });
    return;
  }

  try {
    const res = await leaveGroupService(props.chat.groupId);
    if (res.status === 200) {
      toast.success('Rời nhóm thành công', { timeout: 3000 });
    } else {
      toast.error('Đã xảy ra lỗi khi rời nhóm', { timeout: 3000 });
    }
  } catch (err) {
    console.error(err);
    toast.error('Đã xảy ra lỗi khi rời nhóm', { timeout: 3000 });
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="chat-detail">
    <div class="chat-header">
      <img :src="groupAvatar" :alt="groupName" class="group-avatar">
      <h5 class="group-name">{{ groupName }}</h5>
      <button @click="toggleOptions" class="options-button">
        <i class="ri-menu-line"></i>
      </button>
    </div>
    <div v-if="isLoading" class="loading-indicator">Đang tải tin nhắn...</div>
    <div class="messages-container">
      <div v-for="(msg, index) in messageList" :key="`${props.chat.groupId}-${msg.msgId}-${index}`" :class="{
        'message': msg.message.msgType === 'MESSAGE',
        'system-message': msg.message.msgType !== 'MESSAGE',
        'current-user-message': msg.user.userId === currentUserId && msg.message.msgType === 'MESSAGE',
        'other-user-message': msg.user.userId !== currentUserId
      }">
        <template v-if="msg.message.msgType === 'MESSAGE'">
          <div class="user-info" v-if="msg.user.userId !== currentUserId">
            <img :src="msg.user.avatar" :alt="msg.user.firstName" class="user-avatar">
            <strong>{{ msg.user.firstName }} {{ msg.user.lastName }}</strong>
          </div>
          <div class="message-content">
            <p>{{ msg.message.content }}</p>
            <small>{{ new Date(msg.message.createAt).toLocaleTimeString() }}</small>
          </div>
        </template>
        <template v-else>
          <p>{{ msg.message.content }}</p>
        </template>
      </div>
    </div>

    <div class="input-area">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Nhập tin nhắn...">
      <button @click="sendMessage" class="send-button">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
      <button @click="selectImages" class="image-button">
        <i class="far fa-image"></i>
      </button>
    </div>
  </div>

  <div v-if="showOptions" class="options-overlay">
    <div class="options-content">
      <div class="group-info">
        <img :src="groupAvatar" :alt="groupName" class="group-avatar-big" @click="triggerFileInput">
        <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none">
        <h2 contenteditable @blur="updateGroupName" ref="groupNameElement">{{ groupName }}</h2>
      </div>

      <button @click="toggleMembers" class="toggle-members">
        Hiện danh sách thành viên
      </button>

      <div v-if="showMemberModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Danh sách thành viên</h3>
            <button @click="toggleMemberModal" class="close-modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <ul class="member-list">
            <li v-for="member in members" :key="member.id" class="member-item">
              <span class="member-name">{{ member.name }}</span>
              <input v-if="member.editingNickname" v-model="member.nickname" @blur="updateNickname(member)"
                @keyup.enter="updateNickname(member)" class="nickname-input">
              <span v-else class="member-nickname" @click="toggleEditNickname(member)">
                ({{ member.nickname }})
              </span>
            </li>
          </ul>
        </div>
      </div>

      <button @click="addMember" class="add-member">Thêm thành viên</button>

      <div class="group-settings">
        <h3>Cài đặt nhóm</h3>
        <label class="check-state">
          <input type="checkbox" v-model="isPublic" @change="updateGroupState">
          <span class="slider"></span>
          Nhóm {{ isPublic ? 'công khai' : 'riêng tư' }}
        </label>
      </div>

      <button @click="leaveGroup" class="leave-group">Rời nhóm</button>
      <button @click="toggleOptions" class="close-options">Đóng</button>
    </div>
  </div>
</template>

<style scoped>
.group-info {
  text-align: center;
  margin-bottom: 20px;
}

.members-section ul {
  list-style-type: none;
  padding: 0;
}

.members-section li {
  margin-bottom: 10px;
}

button {
  margin: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.leave-group {
  background-color: #e74c3c;
  color: white;
}

.close-options {
  background-color: #95a5a6;
  color: white;
}

.loading-indicator {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}

.chat-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.group-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

.group-name {
  flex-grow: 1;
  margin: 0;
  font-size: 18px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  max-width: 70%;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.message-content {
  background-color: #ffffff;
  padding: 10px 15px;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-content p {
  margin: 0;
  line-height: 1.4;
}

.message-content small {
  display: block;
  margin-top: 5px;
  color: #888;
  font-size: 0.75em;
}

.system-message {
  text-align: center;
  color: #888;
  font-style: italic;
  margin: 10px 0;
}

.input-area {
  display: flex;
  padding: 15px;
  background-color: #ffffff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.input-area input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 16px;
}

.image-button,
.send-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  margin-left: 5px;
}

.image-button {
  background-color: #3498db;
}

.options-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.options-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.options-content button {
  margin: 10px 0;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.options-content .leave-group {
  background-color: #e74c3c;
  color: white;
}

.options-content .close-options {
  background-color: #95a5a6;
  color: white;
}

.options-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.options-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.group-info {
  text-align: center;
  margin-bottom: 20px;
}

.group-avatar-big {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  margin: 0px auto;
  margin-bottom: 10px;
}

.members-section ul {
  list-style-type: none;
  padding: 0;
}

.members-section li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

button {
  margin: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.leave-group {
  background-color: #e74c3c;
  color: white;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
}

.add-member {
  background-color: #0289ff;
  color: white;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
}

.close-options {
  background-color: #95a5a6;
  color: white;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}

.toggle-members {
  width: 100%;
  background-color: #3498db;
  color: white;
  margin-bottom: 10px;
}

.group-settings {
  margin-top: 20px;
}

.group-settings label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.group-settings input[type="checkbox"] {
  margin-right: 10px;
}

/* Bố cục chính của công tắc */
.check-state {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 13px;
}

/* Ẩn checkbox mặc định */
.check-state input[type="checkbox"] {
  opacity: 0;
  width: 0;
  height: 0;
}

/* Kiểu cho thanh trượt (slider) */
.slider {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 20px;
  margin-right: 10px;
  transition: .4s;
}

/* Kiểu cho nút tròn bên trong công tắc */
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}

/* Khi checkbox được chọn, thay đổi màu nền và vị trí của nút tròn */
input:checked+.slider {
  background-color: #4CAF50;
}

input:checked+.slider:before {
  transform: translateX(20px);
}

/* Tùy chọn: Kiểu cho trạng thái disabled */
input:disabled+.slider {
  background-color: #e6e6e6;
  cursor: not-allowed;
}

input:disabled+.slider:before {
  background-color: #bfbfbf;
}

/* ==================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-modal {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
}

.member-list {
  list-style-type: none;
  padding: 0;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: bold;
}

.member-nickname {
  color: #666;
  cursor: pointer;
}

.nickname-input {
  margin-top: 5px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.kick-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.messages-container {
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 70%;
  margin-bottom: 15px;
}

.current-user-message {
  align-self: flex-end;
  /* background-color: #DCF8C6; */
  border-radius: 15px 15px 0 15px;
  padding: 10px;
  margin-left: 30%;
}

.other-user-message {
  align-self: flex-start;
  /* background-color: #FFFFFF; */
  border-radius: 15px 15px 15px 0;
  padding: 10px;
  margin-right: 30%;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.message-content {
  word-wrap: break-word;
}

.message-content p {
  margin: 0;
}

.message-content small {
  font-size: 0.8em;
  color: #888;
}
</style>