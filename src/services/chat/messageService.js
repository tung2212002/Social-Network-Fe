import * as request from '../../utils/axios';

export const getMessagesService = async (groupId) => {
    const response = await request.apiAuth.get(`/api/v1/chat/messages/${groupId}`);
    return response;
};

export const getReactionMessagesService = async (msgId, status) => {
    const response = await request.apiAuth.get(`/api/v1/chat/reaction/${msgId}?status=${status}`);
    return response;
};

export const reactionMessagesService = async (msgId, body) => {
    const response = await request.apiAuth.post(`/api/v1/chat/reaction/${msgId}`, body);
    return response;
};

export const deleteMessagesService = async (msgId) => {
    const response = await request.apiAuth.delete(`/api/v1/chat/delete/${msgId}`);
    return response;
};

export const recallMessagesService = async (msgId) => {
    const response = await request.apiAuth.delete(`/api/v1/chat/recall/${msgId}`);
    return response;
};

export const typingMessagesService = async (groupId) => {
    const response = await request.apiAuth.post(`/api/v1/chat/messages/typing/${groupId}`);
    return response;
};

export const sendListImagesService = async (groupId, formData) => {
    try {
        const response = await request.apiAuth.post(`/api/v1/chat/send/image/${groupId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('Error uploading images:', error);
        throw error;
    }
};
