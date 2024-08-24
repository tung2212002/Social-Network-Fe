import * as request from '../../utils/axios';

export const getMessagesService = async (groupId) => {
    const response = await request.apiAuth.get(`/api/v1/chat/messages/${groupId}`);
    return response;
};
