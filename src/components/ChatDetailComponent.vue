<script setup>
import { ref, onMounted, computed, watch, nextTick, reactive, inject, onBeforeUnmount } from 'vue';
import { getMessagesService } from '@/services/chat/messageService';
import {
    leaveGroupService,
    changeGroupNameService,
    changeNickNameService,
    changeStateGroupService,
    changeBackgroundGroupService,
    getGroupMembersService,
    kickGroupMemberService,
} from '@/services/chat/groupService';
import {
    getReactionMessagesService,
    reactionMessagesService,
    deleteMessagesService,
    recallMessagesService,
    typingMessagesService,
    sendListImagesService,
    readMessagesService,
} from '@/services/chat/messageService';
import { ringCallService, rejectCallService } from '@/services/chat/callVideo';
import { useToast } from 'vue-toastification';
import { useUserStore } from '@/stores';

const toast = useToast();
const isLoading = ref(true);

const props = defineProps({
    chat: {
        type: Object,
        required: true,
    },
});

console.log('------------------------------------', props.chat);

const wsClient = inject('wsClient'); // Kết nối với WebSocket
const messageList = ref([]); // Danh sách tin nhắn
const showOptions = ref(false); // Hiển thị tùy chọn
const inGroup = computed(() => !props.chat.inGroup); // Kiểm tra xem có trong nhóm không
const showMembers = ref(false); // Hiển thị danh sách thành viên
const groupName = ref(props.chat.groupName); // Tên nhóm
const groupAvatar = ref(props.chat.groupBackground); // Ảnh nền nhóm
const isPublic = ref(true); // Kiểm tra trạng thái nhóm công khai hay riêng tư
const members = ref([]); // Danh sách thành viên
const fileInput = ref(null); // Đầu vào tệp
const groupNameElement = ref(null); // Phần tử tên nhóm
const newMessage = ref(''); // Tin nhắn mới
const userStorage = useUserStore();
const currentUserId = userStorage.getUser.userId;
const selectedImages = ref([]); // Hình ảnh đã chọn
const imageInput = ref(null); // Đầu vào hình ảnh
const newNickName = ref(''); // Biệt danh mới
const reaction = reactive({}); // Phản ứng
const showReactionMessage = ref(false); // Hiển thị tin nhắn phản ứng
const showReaction = reactive({}); // Hiển thị phản ứng
const hoverTimeout = reactive({}); // Thời gian chờ khi hover
const messageFocusId = ref(null); // ID của tin nhắn được chọn
const selectedReaction = ref(null); // Biến để set css reaction chọn
const showOptionsMessage = ref(false); // Hiển thị option tin nhắn
const showReplyMessage = ref(false); // Hiển thị option tin nhắn
const replyMsg = ref('');
const replyMsgId = ref(null);
const typingList = ref([]); // Chứa các người đang typing
let typingTimeout = null;
let typingInterval = null;
let imageFocus = reactive({});
const seenList = ref([]);
const showCallNotification = ref(false);
const ring = ref(false);
const call = ref(true);
const recommendations = ref([]);
const listTags = ref([]);

const showNotification = () => {
    showCallNotification.value = true;
    ringRingRing();
    setTimeout(() => {
        showCallNotification.value = false;
    }, 60000);
};

const closeNotification = () => {
    showCallNotification.value = false;
};

const handlerTyping = async (groupId) => {
    if (typingInterval === null) {
        typingInterval = setInterval(async () => {
            try {
                await typingMessagesService(groupId);
            } catch (error) {
                console.error('Failed to send typing notification', error);
            }
        }, 3000);
    }

    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }

    typingTimeout = setTimeout(() => {
        clearInterval(typingInterval);
        typingInterval = null;
        typingTimeout = null;
    }, 4000);
};

const fetchListMessages = async (groupId) => {
    try {
        const res = await getMessagesService(groupId);
        if (res.status === 200) {
            const data = res.data.data;
            seenList.value = [];

            if (data && Array.isArray(data.message)) {
                // Tạo danh sách tin nhắn từ API
                await nextTick(() => {
                    // Tạo một danh sách tin nhắn để tra cứu thông tin msgQuote
                    const existingMessages = [];

                    messageList.value = data.message
                        .map((msgData) => {
                            let newMessage = {};
                            let msgQuote = null;
                            let msgReply = null;

                            if (msgData.msgReply) {
                                // Xử lý msgReply
                                msgReply = {
                                    user: msgData.msgReply.user || {},
                                    msgId: msgData.msgReply.msgId || '',
                                    message: {
                                        content: msgData.msgReply.message.msgType === 'DELETE' ? 'Tin nhắn đã bị xóa' : msgData.msgReply.message.content || '',
                                        msgType: msgData.msgReply.message.msgType,
                                        createAt: msgData.msgReply.message.createAt || new Date().toISOString(),
                                    },
                                    reactionQuantity: msgData.msgReply.reactionQuantity || 0,
                                    images: msgData.msgReply.images || [],
                                };
                                existingMessages.push(msgReply); // Lưu tin nhắn phản hồi
                            }

                            if (msgData.msgQuote) {
                                // Xử lý msgQuote
                                msgQuote = {
                                    user: msgData.msgQuote.user || {},
                                    msgId: msgData.msgQuote.msgId || '',
                                    message: {
                                        content: msgData.msgQuote.message.content || '',
                                        msgType: msgData.msgQuote.message.msgType,
                                        createAt: msgData.msgQuote.message.createAt || new Date().toISOString(),
                                    },
                                    reactionQuantity: msgData.msgQuote.reactionQuantity || 0,
                                    images: msgData.msgQuote.images || [],
                                };
                            }

                            newMessage = {
                                ...msgReply, // Sử dụng thông tin từ msgReply
                                msgQuote, // Thêm thông tin msgQuote nếu có
                            };

                            return newMessage;
                        })
                        .reverse(); // Đảo ngược danh sách để tin nhắn mới nhất ở đầu
                    console.log(messageList);

                    data.userSeen.map((us) => {
                        seenList.value.push({
                            userId: us.userId,
                            userName: us.firstName + ' ' + us.lastName,
                            avatar:
                                us.avatar ||
                                'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg',
                        });
                    });
                });
            } else {
                console.error('Không thể tải tin nhắn', data);
            }
        } else {
            toast.error('Không thể tải tin nhắn', { timeout: 3000 });
        }
    } catch (err) {
        toast.error('Đã xảy ra lỗi', { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
};

const changeGroupName = async (body) => {
    try {
        const res = await changeGroupNameService(body);
        console.log(res);

        if (res.status === 200) {
            toast.success('Đổi tên nhóm thành công', { timeout: 3000 });
        } else {
            if (res.message === 'You do not have permission to change this group') toast.error('Bạn không đủ quyền', { timeout: 3000 });
            else toast.error('Không thể đổi tên nhóm', { timeout: 3000 });
        }
    } catch (err) {
        toast.error('Đã xảy ra lỗi', { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
};

const setNickName = async () => {
    const body = {
        groupId: props.chat.groupId,
        nickName: newNickName.value,
    };
    try {
        const res = await changeNickNameService(body);
        if (res.status === 200) {
            toast.success('Đổi nickname thành công', { timeout: 3000 });
        } else {
            toast.error('Không thể đổi nickname', { timeout: 3000 });
        }
    } catch (err) {
        toast.error('Đã xảy ra lỗi', { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
};

const changeGroupState = async (stateGroup) => {
    let s = stateGroup ? 'GROUP_PUBLIC' : 'GROUP_PRIVATE';

    try {
        const res = await changeStateGroupService(props.chat.groupId, s);
        if (res.status === 200) {
            toast.success('Thay đổi thành công', { timeout: 3000 });
        } else {
            toast.error('Không thể thay đổi', { timeout: 3000 });
        }
    } catch (err) {
        toast.error('Đã xảy ra lỗi', { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
};

const triggerFileInput = () => {
    fileInput.value.click();
};

const sendMessage = () => {
    if (selectedImages.value.length > 0) {
        handlerSendImage();
        selectedImages.value = [];
        imageInput.value = null;
    } else {
        if (newMessage.value.trim() && wsClient.value && wsClient.value.active) {
            const newMsg = {
                groupId: props.chat.groupId,
                groupType: props.chat.groupType,
                content: newMessage.value,
                msgType: 'MESSAGE',
                replyMsgId: replyMsgId.value,
            };

            wsClient.value.publish({
                destination: `/app/channel`,
                body: JSON.stringify(newMsg),
            });

            newMessage.value = '';
            replyMessage(null, null);
            showReplyMessage.value = false;
        } else if (!wsClient.value || !wsClient.value.active) {
            toast.error('WebSocket connection is not active. Please try again later.', { timeout: 3000 });
        }
    }
};

const subscribeToWebSocket = () => {
    if (wsClient.value && wsClient.value.active) {
        wsClient.value.subscribe(`/channel/app/${currentUserId}`, (message) => {
            console.log('msg111 ' + message.body);
            fetchListMessages(props.chat.groupId);
            // handleReceivedMessage(JSON.parse(message.body));
            handleReceivedCallVideo(JSON.parse(message.body));
            handleTyping(JSON.parse(message.body));
        });
    }
};

const handleReceivedCallVideo = (message) => {
    if (message.msgType === 'CALL') {
        if (message.groupId !== props.chat.groupId) {
            showCallNotification.value = true;
            call.value = true;
        }
    }
    if (message.msgType === 'REJECT_CALL') {
        if (message.groupId !== props.chat.groupId) {
            showCallNotification.value = false;
            call.value = false;
        }
    }
};

const handleTyping = (message) => {
    if (message.msgType === 'TYPING') {
        const existingTypingIndex = typingList.value.findIndex((t) => t.userId === message.user.userId);

        if (existingTypingIndex === -1) {
            // Thêm người dùng mới vào danh sách typing
            const newTypingUser = {
                userId: message.user.userId,
                avatar: message.user.avatar,
                typingTimeout: setTimeout(() => {
                    removeTypingUser(message.user.userId);
                }, 5000), // Xóa sau 5 giây nếu không nhận được thông báo typing mới
            };
            typingList.value.push(newTypingUser);
        } else {
            // Cập nhật timeout cho người dùng đã tồn tại
            clearTimeout(typingList.value[existingTypingIndex].typingTimeout);
            typingList.value[existingTypingIndex].typingTimeout = setTimeout(() => {
                removeTypingUser(message.user.userId);
            }, 5000);
        }
    }
};

const removeTypingUser = (userId) => {
    const index = typingList.value.findIndex((t) => t.userId === userId);
    if (index !== -1) {
        clearTimeout(typingList.value[index].typingTimeout);
        typingList.value.splice(index, 1);
    }
};

const selectImages = () => {
    imageInput.value.click();
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

const handlerSendImage = async () => {
    if (!selectedImages.value || selectedImages.value.length === 0) {
        toast.error('Vui lòng chọn ít nhất một ảnh để gửi', { timeout: 3000 });
        return;
    }

    try {
        isLoading.value = true;
        const formData = new FormData();

        selectedImages.value.forEach((image) => {
            formData.append('image', image.file, image.file.name);
        });

        console.log('FormData entries:');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        const res = await sendListImagesService(props.chat.groupId, formData);
        if (res.status === 200) {
            toast.success('Gửi ảnh thành công', { timeout: 3000 });
            selectedImages.value = []; // Xóa danh sách ảnh đã chọn sau khi gửi thành công
        } else {
            toast.error('Không thể gửi ảnh', { timeout: 3000 });
        }
    } catch (err) {
        console.error('Lỗi khi gửi ảnh:', err);
        toast.error('Đã xảy ra lỗi khi gửi ảnh', { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
};

const updateGroupAvatar = async (file) => {
    try {
        const res = await changeBackgroundGroupService(props.chat.groupId, file);
        if (res.status === 200) {
            toast.success('Đổi ảnh nhóm thành công', { timeout: 3000 });
        } else {
            toast.error('Không thể đổi ảnh nhóm', { timeout: 3000 });
        }
    } catch (err) {
        toast.error('Đã xảy ra lỗi', { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
};

const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
    }));
    selectedImages.value = [...selectedImages.value, ...newImages];
    event.target.value = '';
};

const removeImage = (index) => {
    URL.revokeObjectURL(selectedImages.value[index].url);
    selectedImages.value.splice(index, 1);
};

onBeforeUnmount(() => {
    selectedImages.value.forEach((image) => URL.revokeObjectURL(image.url));
});

const toggleOptions = () => {
    showOptions.value = !showOptions.value;
};

const fetchGroupDetails = async () => {
    try {
        const res = await getGroupMembersService(props.chat.groupId);
        const datas = res.data.data;
        if (res.status === 200) {
            datas.map((data) => {
                members.value.push({
                    userId: data.user.userId,
                    avatar:
                        data.user.avatar ||
                        'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg',
                    username: data.user.firstName + ' ' + data.user.lastName,
                    nickname: data.member.nickname,
                });
            });
        } else {
            // toast.error('Đã xảy ra lỗi', { timeout: 3000 });
        }
    } catch (err) {
        toast.error('Đã xảy ra lỗi', { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
};

const showMemberModal = ref(false);
const toggleMemberModal = () => {
    showMemberModal.value = !showMemberModal.value;
    showMembers.value = false;
};

const toggleMembers = () => {
    showMembers.value = true;
    if (showMembers.value) {
        toggleMemberModal();
    }
};

const updateGroupName = () => {
    const newName = groupNameElement.value.innerText.trim();
    if (newName && newName !== groupName.value) {
        groupName.value = newName;
        changeGroupName({
            groupId: props.chat.groupId,
            groupName: newName,
        });
    }
};

const kickMember = async (member) => {
    if (confirm(`Bạn có chắc muốn xóa ${member.username} khỏi nhóm không?`)) {
        try {
            let body = {
                groupId: props.chat.groupId + '',
                memberId: [member.userId],
            };
            const res = await kickGroupMemberService(body);

            if (res.status === 200) {
                toast.error('Đã kick ' + member.username + ' thành công', { timeout: 3000 });
            } else {
                toast.error('Đã xảy ra lỗi', { timeout: 3000 });
            }
        } catch (err) {
            toast.error('Đã xảy ra lỗi', { timeout: 3000 });
        } finally {
            isLoading.value = false;
        }
    }
};

const addMember = () => {
    const newMemberName = prompt('Nhập tên của thành viên mới:');
    if (newMemberName) {
        const newMember = {
            id: Date.now(),
            name: newMemberName,
            nickname: '',
            editingNickname: false,
        };
        members.value.push(newMember);
        toast.success('Đã thêm thành viên mới');
    }
};

const leaveGroup = async () => {
    if (!props.chat?.groupId) {
        toast.error('Không tìm thấy ID nhóm', { timeout: 3000 });
        return;
    }

    try {
        const res = await leaveGroupService(props.chat.groupId);
        if (res.status === 200) {
            toast.success('Rời nhóm thành công', { timeout: 3000 });
            inGroup.value = false;
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

const fetchReactionMessage = async (msgId, state) => {
    selectedReaction.value = state;
    try {
        const res = await getReactionMessagesService(msgId, state);
        if (res.status === 200) {
            const datas = res.data.data.user;

            let users = [];
            if (datas !== null)
                datas.map((data) => {
                    users.push({
                        userId: data.userId,
                        userName: data.firstName + ' ' + data.lastName,
                        avatar:
                            data.avatar ||
                            'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg',
                    });
                });
            reaction['like'] = res.data.data.countLike;
            reaction['love'] = res.data.data.countLove;
            reaction['angry'] = res.data.data.countAngry;
            reaction['smile'] = res.data.data.countSmile;
            reaction['users'] = users;
            console.log(reaction);
        } else {
            toast.error('Đã xảy ra lỗi', { timeout: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.error('Đã xảy ra lỗi', { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
};

const setShowReaction = (msgId, value) => {
    clearTimeout(hoverTimeout[msgId]);
    showReaction[msgId] = value;
};

const handleMouseLeave = (msgId) => {
    hoverTimeout[msgId] = setTimeout(() => {
        showReaction[msgId] = false;
    }, 300);
};

const handleReaction = async (msgId, reactionType) => {
    try {
        const res = await reactionMessagesService(msgId, {
            reactionType: reactionType,
        });
        fetchListMessages(props.chat.groupId);
        if (res.status === 200) {
            toast.success('Reaction added successfully', { timeout: 3000 });
        } else {
            toast.error('Failed to add reaction', { timeout: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.error('An error occurred while adding reaction', { timeout: 3000 });
    }
};

const reactionMsg = (messageId) => {
    messageFocusId.value = messageId;
    showReactionMessage.value = !showReactionMessage.value;
    fetchReactionMessage(messageId, 'LIKE');
};

const handleClickOutside = () => {
    showReactionMessage.value = false;
};

const setShowOptionsMsg = (msgId) => {
    if (showOptionsMessage.value === true && messageFocusId.value !== msgId) showOptionsMessage.value = false;
    showOptionsMessage.value = !showOptionsMessage.value;
    messageFocusId.value = msgId;
};

const setNoShowOptionMsg = () => {
    showOptionsMessage.value = false;
};

const deleteMessage = async (msgId) => {
    try {
        const res = await deleteMessagesService(msgId);
        if (res.status === 200) {
            messageList.value.forEach((msg) => {
                if (msgId === msg.msgId) {
                    msg.message = {
                        content: 'Tin nhắn đã bị xóa',
                        msgType: 'DELETE',
                        createdAt: msg.msgReply?.createdAt || new Date().toISOString(),
                    };
                }
                if (msg.msgQuote?.msgId === msgId) {
                    msg.msgQuote.message = {
                        content: 'Tin nhắn đã bị xóa',
                        msgType: 'DELETE',
                    };
                }
            });
            showOptionsMessage.value = false;
        } else {
            toast.error('Đã xảy ra lỗi', { timeout: 3000 });
        }
    } catch (err) {
        toast.error('Đã xảy ra lỗi', { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
};

const recallMessage = async (msgId) => {
    try {
        const res = await recallMessagesService(msgId);
        if (res.status === 200) {
            messageList.value = messageList.value.filter((msg) => msg.msgId !== msgId);
            messageList.value.forEach((msg) => {
                if (msgId === msg.msgQuote?.msgId) {
                    msg.msgQuote.message = {
                        content: '',
                        msgType: 'MESSAGE',
                    };
                }
            });
            showOptionsMessage.value = false;
        } else {
            toast.error('Đã xảy ra lỗ1', { timeout: 3000 });
        }
    } catch (err) {
        toast.error('Đã xảy ra lỗi', { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
};

const replyMessage = (msgId, content) => {
    showReplyMessage.value = !showReplyMessage.value;
    replyMsg.value = content;
    replyMsgId.value = msgId;
};

const setShowImage = (image) => {
    imageFocus['url'] = image;
    imageFocus['check'] = true;
};

const setUnShowImage = () => {
    imageFocus['url'] = null;
    imageFocus['check'] = false;
};

const ringRingRing = async () => {
    try {
        const res = await ringCallService(props.chat.groupId);
        if (res.status === 200) {
            ring.value = true;
            call.value = true;
        } else {
            toast.error('Đã xảy ra lỗ1', { timeout: 3000 });
        }
    } catch (err) {
        toast.error('Đã xảy ra lỗi', { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
};

const receiverCallVideo = () => {
    location.href = `http://localhost:3001/call.html/${props.chat.groupId}`;
};

const rejectCall = async () => {
    try {
        const res = await rejectCallService(props.chat.groupId);
        if (res.status === 200) {
            ring.value = false;
        } else {
            toast.error('Đã xảy ra lỗ1', { timeout: 3000 });
        }
    } catch (err) {
        toast.error('Đã xảy ra lỗi', { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
};

const handlerTag = (value) => {
    const atIndex = value.lastIndexOf('@');

    if (atIndex !== -1) {
        const searchQuery = value
            .substring(atIndex + 1)
            .trim()
            .toLowerCase();

        recommendations.value = members.value.filter(
            (member) => member.username.toLowerCase().includes(searchQuery) || member.nickname.toLowerCase().includes(searchQuery),
        );
    } else {
        recommendations.value = [];
    }
};

const handleAddTagUser = (userId) => {
    const currentText = newMessage.value;
    const atIndex = currentText.lastIndexOf('@');

    if (atIndex !== -1) {
        const newText = currentText.substring(0, atIndex) + `<@${userId}> `;
        newMessage.value = newText;

        recommendations.value = [];
    }
};

const handelReadMessage = async () => {
    await readMessagesService(messageList.value[messageList.value.length - 1].msgId);
};

// const displayMessage = computed({
//   get() {
//     return newMessage.value.replace(/<@(\d+)>/g, (match, userId) => {
//       return getUserName(userId) || match;
//     });
//   },
//   set(value) {
//     newMessage.value = value.replace(/@(\w+)/g, (match, username) => {
//       const userId = getUserId(username);
//       return userId ? `<@${userId}>` : match;
//     });
//   }
// });

// function getUserName(userId) {
//   return members.value.filter(u => u.userId === userId).userId;
// }

onMounted(() => {
    if (props.chat?.groupId) {
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
            fetchListMessages(newChat.groupId);
        }
    },
    { immediate: true, deep: true },
);
</script>

<template>
    <div class="chat-detail">
        <div class="chat-header">
            <img :src="props.chat.groupBackground" :alt="props.chat.groupName" class="group-avatar" />
            <h5 class="group-name">{{ props.chat.groupName }}</h5>
            <i class="ri-customer-service-fill" v-if="props.chat.groupType === 'PERSONAL'" @click="showNotification"></i>
            <button @click="toggleOptions" class="options-button">
                <i class="ri-menu-line"></i>
            </button>
        </div>
        <div v-if="isLoading" class="loading-indicator">Đang tải tin nhắn...</div>
        <div class="messages-container">
            <div
                v-for="(msg, index) in messageList"
                :key="`${props.chat.groupId}-${msg.msgId}-${index}`"
                :class="{
                    message: msg.message.msgType === 'MESSAGE',
                    'delete-message': msg.message.msgType === 'DELETE',
                    'system-message': msg.message.msgType !== 'MESSAGE',
                    'current-user-message':
                        (msg.user.userId === currentUserId && msg.message.msgType === 'MESSAGE') ||
                        msg.message.msgType === 'DELETE' ||
                        msg.message.msgType === 'IMAGE',
                    'other-user-message': msg.user.userId !== currentUserId,
                }"
            >
                <div class="message-reply message-content" v-if="msg.msgQuote && msg.msgQuote.message.content != ''">{{ msg.msgQuote.message.content }}</div>
                <div class="message-wrapper">
                    <div
                        :class="{ 'option-message-container': true, 'option-other-user': msg.user.userId !== currentUserId }"
                        v-if="showOptionsMessage && messageFocusId === msg.msgId"
                        v-click-outside="setNoShowOptionMsg"
                    >
                        <button class="button-option" v-if="msg.user.userId === currentUserId" @click="deleteMessage(msg.msgId)">Xóa tin nhắn</button>
                        <button class="button-option" v-if="msg.user.userId === currentUserId" @click="recallMessage(msg.msgId)">Thu hồi tin nhắn</button>
                        <button class="button-option" @click="replyMessage(msg.msgId, msg.message.content)">Trả lời tin nhắn</button>
                    </div>

                    <div class="user-info" v-if="msg.user.userId !== currentUserId">
                        <img :src="msg.user.avatar" :alt="msg.user.firstName" class="user-avatar" />
                        <strong>{{ msg.user.firstName }} {{ msg.user.lastName }}</strong>
                    </div>
                    <div class="left-message">
                        <div
                            :class="{ 'option-message': msg.user.userId === currentUserId }"
                            v-if="msg.user.userId === currentUserId && (msg.message.msgType === 'MESSAGE' || msg.message.msgType === 'IMAGE')"
                            @click="setShowOptionsMsg(msg.msgId)"
                            style="margin-right: 7px"
                        >
                            <i class="fa-regular fa-comment-dots"></i>
                        </div>
                        <template v-if="msg.message.msgType === 'MESSAGE'">
                            <div class="message-content" @mouseenter="setShowReaction(msg.msgId, true)" @mouseleave="handleMouseLeave(msg.msgId)">
                                <div class="reaction-menu" v-show="showReaction[msg.msgId]">
                                    <i class="reaction-item fa-solid fa-thumbs-up" @click="handleReaction(msg.msgId, 'LIKE')"></i>
                                    <i class="reaction-item fa-solid fa-heart" @click="handleReaction(msg.msgId, 'LOVE')"></i>
                                    <i class="reaction-item fa-solid fa-face-angry" @click="handleReaction(msg.msgId, 'ANGRY')"></i>
                                    <i class="reaction-item fa-regular fa-face-grin-squint-tears" @click="handleReaction(msg.msgId, 'SMILE')"></i>
                                </div>
                                <p class="wrapped-text">{{ msg.message.content }}</p>
                                <small>{{ new Date(msg.message.createAt).toLocaleTimeString() }}</small>
                                <div class="reaction-trigger" @click="reactionMsg(msg.msgId)" tabindex="0">
                                    <i class="fa-regular fa-thumbs-up"></i>
                                    <i class="fa-solid fa-heart"></i>
                                    <b style="margin-left: 10px">{{ msg.reactionQuantity }}</b>
                                </div>
                            </div>
                            <div
                                class="option-message"
                                v-if="msg.user.userId !== currentUserId && (msg.message.msgType === 'MESSAGE' || msg.message.msgType === 'IMAGE')"
                                @click="setShowOptionsMsg(msg.msgId)"
                                style="margin-left: 7px"
                            >
                                <i class="fa-regular fa-comment-dots"></i>
                            </div>
                        </template>

                        <template v-else-if="msg.message.msgType !== 'IMAGE'">
                            <p>{{ msg.message.content }}</p>
                        </template>
                        <template v-else>
                            <div
                                v-if="msg.images && msg.images.length > 0"
                                :class="['image-container', msg.user.userId === currentUserId ? 'image-right' : 'image-left']"
                            >
                                <div v-for="(image, index) in msg.images" :key="index" class="selected-image">
                                    <img :src="image" alt="Selected image" @click="setShowImage(image)" />
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="seen-user">
            <div v-for="(user, index) in seenList" :key="index">
                <img class="img-typing" :src="user.avatar" alt="User avatar" v-if="user.userId !== currentUserId" />
            </div>
        </div>
        <div class="typing-container" v-if="typingList.length > 0">
            <div v-for="(user, index) in typingList" :key="index" class="typing-user">
                <img class="img-typing" :src="user.avatar" alt="User avatar" />
            </div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
        <div
            v-if="showReactionMessage"
            class="modal-overlay"
            @mouseleave="
                () => {
                    console.log('hello');
                }
            "
        >
            <div class="reactions-container" ref="modalContentRef" v-click-outside="handleClickOutside">
                <div>
                    <i
                        @click="fetchReactionMessage(messageFocusId, 'LIKE')"
                        :class="['icon-reaction', 'fa-solid', 'fa-thumbs-up', { 'choose-reaction': selectedReaction === 'LIKE' }]"
                    >
                        {{ ' ' + reaction['like'] }}
                    </i>
                    <i
                        @click="fetchReactionMessage(messageFocusId, 'LOVE')"
                        :class="['icon-reaction', 'fa-solid', 'fa-heart', { 'choose-reaction': selectedReaction === 'LOVE' }]"
                    >
                        {{ ' ' + reaction['love'] }}
                    </i>
                    <i
                        @click="fetchReactionMessage(messageFocusId, 'ANGRY')"
                        :class="['icon-reaction', 'fa-solid', 'fa-face-angry', { 'choose-reaction': selectedReaction === 'ANGRY' }]"
                    >
                        {{ ' ' + reaction['angry'] }}
                    </i>
                    <i
                        @click="fetchReactionMessage(messageFocusId, 'HAHA')"
                        :class="['icon-reaction', 'fa-solid', 'fa-face-smile', { 'choose-reaction': selectedReaction === 'HAHA' }]"
                    >
                        {{ ' ' + reaction['smile'] }}
                    </i>
                </div>
                <ul class="member-list">
                    <li v-for="member in reaction.users" :key="member.userId" class="member-item">
                        <img :src="member.avatar" :alt="member.userName" class="member-avatar" />
                        <div class="member-info">
                            <span class="member-name">{{ member.userName }}</span>
                            <!-- <span class="member-nickname">({{ member.nickname }})</span> -->
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="reply-container" v-if="showReplyMessage">
            <div>{{ replyMsg }}</div>
            <i class="close-item fa-solid fa-circle-xmark" @click="replyMessage(null, null)"></i>
        </div>

        <div class="tag-tag-container" v-if="recommendations.length > 0">
            <div v-for="(tag, index) in recommendations" :key="index">
                <div class="tag-container" @click="handleAddTagUser(tag.userId, tag.username)">
                    <img :src="tag.avatar" alt="Selected image" style="width: 20px; height: 20px; border-radius: 50%" />
                    <div class="tag-name">{{ tag.username }}</div>
                </div>
            </div>
        </div>

        <div v-if="inGroup" class="input-area">
            <input
                v-model="newMessage"
                @input="
                    (event) => {
                        handlerTyping(props.chat.groupId);
                        handlerTag(event.target.value);
                    }
                "
                @keyup.enter="sendMessage"
                @click="handelReadMessage"
                placeholder="Nhập tin nhắn..."
            />
            <button @click="sendMessage" class="send-button">
                <i class="fa-solid fa-paper-plane"></i>
            </button>
            <button @click="selectImages" class="image-button">
                <i class="far fa-image"></i>
            </button>
            <input type="file" ref="imageInput" @change="handleImageChange" multiple accept="image/*" style="display: none" />
        </div>
        <div v-if="selectedImages.length > 0" class="selected-images">
            <div v-for="(image, index) in selectedImages" :key="index" class="selected-image">
                <img :src="image.url" alt="Selected image" />
                <button @click="removeImage(index)" class="remove-image">X</button>
            </div>
        </div>
        <div v-if="!inGroup" class="not-in-group-message">Bạn không thể gửi tin nhắn trong nhóm này.</div>
    </div>

    <div v-if="showOptions" class="options-overlay">
        <div class="options-content" v-click-outside="toggleOptions">
            <div class="group-info">
                <img :src="props.chat.groupBackground" :alt="groupName" class="group-avatar-big" @click="triggerFileInput" />
                <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none" />
                <h2 contenteditable @keyup.enter="updateGroupName" ref="groupNameElement">{{ props.chat.groupName }}</h2>
            </div>

            <button @click="toggleMembers" class="toggle-members">Hiện danh sách thành viên</button>

            <div v-if="showMemberModal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Danh sách thành viên</h3>
                        <button @click="toggleMemberModal" class="close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <ul class="member-list">
                        <li v-for="member in members" :key="member.userId" class="member-item">
                            <img :src="member.avatar" :alt="member.username" class="member-avatar" />
                            <div class="member-info">
                                <span class="member-name">{{ member.username }}</span>
                                <span class="member-nickname">({{ member.nickname }})</span>
                            </div>
                            <button @click="kickMember(member)" class="kick-button">Kick</button>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="nick-name">
                <input
                    type="text"
                    class="input-nick-name"
                    @change="
                        (e) => {
                            newNickName = e.target.value;
                        }
                    "
                    placeholder="Thay đổi nick name"
                />
                <button class="set-nick-name" @click="setNickName">Thay đổi</button>
            </div>
            <button @click="addMember" class="add-member">Thêm thành viên</button>

            <div class="group-settings">
                <h3>Cài đặt nhóm</h3>
                <label class="check-state">
                    <input type="checkbox" v-model="isPublic" @change="changeGroupState(isPublic)" />
                    <span class="slider"></span>
                    Nhóm {{ !isPublic ? 'công khai' : 'riêng tư' }}
                </label>
            </div>

            <button @click="leaveGroup" class="leave-group">Rời nhóm</button>
            <button @click="toggleOptions" class="close-options">Đóng</button>
        </div>
    </div>
    <div class="fullscreen-container" v-if="imageFocus['check']">
        <img :src="imageFocus['url']" alt="Image" class="fullscreen-image" />
        <button class="close-button" @click="setUnShowImage">×</button>
    </div>
    <div v-if="showCallNotification" class="call-notification">
        <div class="notification-content">
            <p v-if="!call">
                Đang gọi<strong>{{ callerName }}</strong>
            </p>
            <p v-else>
                Nhận cuộc gọi từ <strong>{{ callerName }}</strong>
            </p>
            <button v-if="!call" class="toggle-members" @click="receiverCallVideo">Nhận cuộc gọi</button>
            <button v-if="!call" class="leave-group" style="margin: 0px 5px" @click="rejectCall">Từ chối</button>
            <button v-else class="leave-group" style="margin: 0px 5px" @click="rejectCall">Hủy cuộc gọi</button>
            <button class="close-options" @click="closeNotification">Đóng</button>
        </div>
    </div>
</template>

<style scoped>
.tag-tag-container {
    position: absolute;
    bottom: 50px;
}

.tag-tag-container :hover {
    background-color: #ccc;
}

.tag-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    padding-left: 15px;
}

.tag-container :hover {
    cursor: pointer;
}

.tag-name {
    width: 100px;
    font-size: 16px;
    margin: 10px;
}

.tag-image {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
    display: flex;
}

.call-notification {
    position: fixed;
    top: 20px;
    left: 20px;
    padding: 16px;
    background-color: #ffffff;
    border: 1px solid #d1d1d1;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
    z-index: 1000;
}

.notification-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    margin-right: 11px;
}

.notification-text {
    margin: 0;
    font-size: 16px;
    color: #333;
}

.ri-customer-service-fill:hover {
    cursor: pointer;
}

.option-other-user {
    bottom: 40px;
    left: 130px;
}

.left-message {
    display: flex;
    align-items: center;
}

.seen-user {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin: 5px;
}

.fullscreen-container {
    position: absolute;
    left: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
}

.fullscreen-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: black;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 30px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.wrapped-text {
    word-wrap: break-word;
    max-width: 300px;
}

.message-reply {
    bottom: -8px;
}

.close-item :hover {
    cursor: pointer;
}

.reply-container {
    background-color: white;
    font-size: 20px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
}

.img-typing {
    width: 20px;
    height: 20px;
    border-radius: 5 0%;
    padding-right: 3px;
}

.dot {
    width: 8px;
    height: 8px;
    background-color: #000000d5;
    border-radius: 50%;
    animation: typing 1.5s infinite;
}

.dot:nth-child(2) {
    animation-delay: 0.3s;
}

.dot:nth-child(3) {
    animation-delay: 0.6s;
}

@keyframes typing {
    0%,
    60%,
    100% {
        transform: translateY(0);
    }

    30% {
        transform: translateY(-7px);
    }
}

.typing-container {
    position: relative;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 50px;
    margin: 10px;
}

.button-option:hover {
    box-shadow: 0.3px 4px 6px rgba(0.1, 0, 0, 0.1);
    background-color: rgba(250, 249, 249, 0.837);
}

.option-message-container {
    position: absolute;
    width: 200px;
    right: 105%;
    z-index: 99;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 5px;
}

.option-message:hover {
    cursor: pointer;
}

.reaction-message:hover {
    cursor: pointer;
}

.reactions-container {
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    margin: auto auto;
    background-color: white;
    border-radius: 20px;
    padding: 5px 20px;
}

.icon-reaction {
    padding: 5px;
    margin-bottom: 5px;
    font-size: 50px;
    margin-right: 10px;
}

.icon-reaction:hover {
    cursor: pointer;
    color: #007bff;
    transform: scale(1.1);
}

.choose-reaction {
    color: #007bff;
    transform: scale(1.1);
}

.member-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.input-nick-name {
    margin-right: 20px;
}

.input-nick-name:focus {
    outline: none;
}

.selected-images {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 8px;
    margin-bottom: 10px;
}

.selected-image {
    position: relative;
    width: 60px;
    height: 60px;
}

.selected-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
}

.remove-image {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.input-area {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-top: 1px solid #e0e0e0;
}

.input-area input {
    flex-grow: 1;
    margin-right: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.send-button,
.image-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
}

.image-button {
    background-color: #28a745;
}

.not-in-group-message {
    text-align: center;
    padding: 15px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    margin-top: 10px;
}

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

.set-nick-name {
    background-color: #0289ff;
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
    position: relative;
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
    width: 600px;
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

.message-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
}

.message-content {
    position: relative;
    display: inline-block;
}

.reaction-menu {
    position: absolute;
    bottom: 30px;
    left: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 5px 10px;
    display: flex;
    gap: 10px;
    z-index: 10;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.reaction-item:hover {
    color: #321fff;
    padding: 3px;
    border-radius: 50%;
}

.reaction-menu i {
    cursor: pointer;
    font-size: 1.2em;
}

.reaction-trigger {
    cursor: pointer;
    display: inline-block;
    margin-left: 5px;
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

.leave-group,
.add-member {
    width: 100%;
    padding: 10px;
    margin-top: 20px;
}

.add-member {
    background-color: #0289ff;
    color: white;
}

.close-options {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
}

.toggle-members {
    width: 100%;
    background-color: #0289ff;
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

.group-settings input[type='checkbox'] {
    margin-right: 10px;
}

.check-state {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 13px;
}

.check-state input[type='checkbox'] {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
    background-color: #ccc;
    border-radius: 20px;
    margin-right: 10px;
    transition: 0.4s;
}

.slider:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
}

input:checked + .slider {
    background-color: #4caf50;
}

input:checked + .slider:before {
    transform: translateX(20px);
}

input:disabled + .slider {
    background-color: #e6e6e6;
    cursor: not-allowed;
}

input:disabled + .slider:before {
    background-color: #bfbfbf;
}

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
}

.member-name {
    font-weight: bold;
    margin-right: 10px;
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

.current-user-message {
    align-self: flex-end;
    border-radius: 15px 15px 0 15px;
    padding: 10px;
    margin-left: 30%;
}

.delete-message {
    background-color: none;
    border: 1px solid black;
}

.other-user-message {
    align-self: flex-start;
    border-radius: 15px 15px 15px 0;
    padding: 10px;
    margin-right: 30%;
}

.message-content {
    word-wrap: break-word;
}
</style>
