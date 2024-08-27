<template>
  <div :class="['chat-item', { 'selected': isSelected }]" @click="handleClick">
    <div class="avatar-container">
      <img :src="avatarSrc" :alt="`${groupName} Avatar`" class="avatar">
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

<script setup>
import { computed } from 'vue';

const props = defineProps({
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
    default: 0
  },
  online: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select']);

const avatarSrc = computed(() => props.groupBackground || '/path/to/default-avatar.jpg');

const isUnread = computed(() => props.messageUnreadCount > 0);

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

const handleClick = () => {
  emit('select', props.groupId);
};
</script>

<style scoped>
.chat-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-item:hover {
  background-color: #f0f0f0;
}

.chat-item.selected {
  background-color: #ea1313;
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
  object-position: center;
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
}

h3 {
  margin: 0;
  font-size: 16px;
}

.status-indicator {
  font-size: 12px;
  color: #888;
}

.status-indicator.online {
  color: #4CAF50;
}

.last-message {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread {
  font-weight: bold;
}

.unread-indicator {
  background-color: #4CAF50;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
</style>