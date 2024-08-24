<template>
  <div class="chat-item" @click="$emit('click')">
    <div class="avatar-container">
      <img :src="avatarSrc" alt="Group Avatar" class="avatar">
      <span v-if="online" class="online-indicator"></span>
    </div>
    <div class="chat-info">
      <div class="chat-header">
        <h3 :class="{ 'unread': isUnread }">{{ groupName }}</h3>
        <span class="status-indicator" :class="{ 'online': online, 'offline': !online }">
          {{ statusText }}
        </span>
      </div>
      <p class="last-message" :class="{ 'unread': isUnread }">{{ lastMessage || 'No messages yet' }}</p>
    </div>
    <div v-if="isUnread" class="unread-indicator">{{ messageUnreadCount }}</div>
  </div>
</template>

<script>
import { computed } from 'vue';


export default {
  name: 'SidebarChatItem',
  props: {
    groupId: {
      type: String,
      required: true
    },
    groupName: {
      type: String,
      required: true
    },
    lastMessage: {
      type: String,
      default: null
    },
    groupBackground: {
      type: String,
      default: null
    },
    lastActive: {
      type: String,
      default: null
    },
    messageUnreadCount: {
      type: Number,
      default: null
    },
    online: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const avatarSrc = computed(() => props.groupBackground || '/path/to/default-avatar.jpg');

    const isUnread = computed(() => props.messageUnreadCount !== null && props.messageUnreadCount > 0);

    const statusText = computed(() => {
      if (props.online) return 'Online';
      if (!props.lastActive) return 'Offline';
      
      const lastActiveDate = new Date(props.lastActive);
      const now = new Date();
      const diffInHours = Math.floor((now - lastActiveDate) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Active recently';
      if (diffInHours < 24) return `Active ${diffInHours} hours ago`;
      return `Active ${Math.floor(diffInHours / 24)} days ago`;
    });

    return {
      avatarSrc,
      isUnread,
      statusText
    };
  }
}
</script>

<style scoped>
.chat-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
}

.chat-item:hover {
  background-color: #f0f0f0;
}

.avatar-container {
  position: relative;
  margin-right: 10px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #4CAF50;
  border-radius: 50%;
  border: 2px solid white;
}

.chat-info {
  flex: 1;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

h3 {
  margin: 0;
  font-size: 16px;
}

.unread {
  font-weight: bold;
  color: #007bff;
}

.status-indicator {
  font-size: 12px;
  color: #666;
}

.status-indicator.online {
  color: #4CAF50;
}

.last-message {
  margin: 0;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-indicator {
  position: absolute;
  top: 60%;
  right: 10px;
  transform: translateY(-50%);
  background-color: #ff4b4b;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}
</style>