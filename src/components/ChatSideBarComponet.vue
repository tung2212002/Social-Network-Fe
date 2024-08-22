<template>
    <div class="chat-item" @click="$emit('click')">
      <div class="avatar-container">
        <img :src="avatarSrc" alt="Group Avatar" class="avatar">
        <span v-if="online" class="online-indicator"></span>
      </div>
      <div class="chat-info">
        <h3 :class="{ 'unread': messageUnreadCount > 0 }">{{ groupName }}</h3>
        <p class="last-message">{{ lastMessage || 'No messages yet' }}</p>
      </div>
    </div>
  </template>
  
  <script>
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
        default: 0
      },
      online: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      avatarSrc() {
        return this.groupBackground || '/path/to/default-avatar.jpg';
      }
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
  
  h3 {
    margin: 0 0 5px;
    font-size: 16px;
  }
  
  .unread {
    font-weight: bold;
  }
  
  .last-message {
    margin: 0;
    font-size: 14px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>