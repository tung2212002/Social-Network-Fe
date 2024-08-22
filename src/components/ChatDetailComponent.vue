<script setup>
import { ref } from 'vue';

const props = defineProps({
  chat: {
    type: Object,
    required: true
  }
});

const messages = ref([
  { id: 1, sender: 'User1', content: 'Xin chào!', timestamp: '10:00' },
  { id: 2, sender: 'User2', content: 'Chào bạn!', timestamp: '10:01' },
  // Thêm các tin nhắn mẫu khác
]);

const newMessage = ref('');
const showOptions = ref(false);

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: messages.value.length + 1,
      sender: 'CurrentUser',
      content: newMessage.value,
      timestamp: new Date().toLocaleTimeString()
    });
    newMessage.value = '';
  }
};

const toggleOptions = () => {
  showOptions.value = !showOptions.value;
};

const selectImages = () => {
  // Xử lý chọn nhiều ảnh
  console.log('Chọn ảnh');
};

const leaveGroup = () => {
  console.log('Rời nhóm');
  showOptions.value = false;
};

const addMember = () => {
  console.log('Thêm thành viên');
  showOptions.value = false;
};
</script>

<template>
  <div class="chat-detail">
    <div class="chat-header">
      <img :src="chat.avatar" :alt="chat.groupName" class="group-avatar">
      <h2>{{ chat.groupName }}</h2>
      <button @click="toggleOptions" class="options-button">...</button>
    </div>
    
    <div class="messages-container">
      <div v-for="message in messages" :key="message.id" class="message">
        <strong>{{ message.sender }}</strong>
        <p>{{ message.content }}</p>
        <small>{{ message.timestamp }}</small>
      </div>
    </div>
    
    <div class="input-area">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Nhập tin nhắn...">
      <button @click="selectImages" class="image-button">🖼️</button>
      <button @click="sendMessage" class="send-button">Gửi</button>
    </div>
    
    <div v-if="showOptions" class="options-modal">
      <div class="options-content">
        <button @click="leaveGroup">Rời nhóm</button>
        <button @click="addMember">Thêm thành viên</button>
        <button @click="toggleOptions">Đóng</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.group-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.options-button {
  margin-left: auto;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
}

.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #e0e0e0;
}

.input-area input {
  flex: 1;
  margin-right: 10px;
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
  border-radius: 5px;
}
</style>