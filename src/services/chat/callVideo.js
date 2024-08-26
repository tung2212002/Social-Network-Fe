import * as request from '../../utils/axios';

export const ringCallService = async (groupId) => {
    const response = await request.apiAuth.post(`/api/v1/chat/video-call/${groupId}`);
    return response;
};

export const rejectCallService = async (groupId) => {
    const response = await request.apiAuth.post(`/api/v1/chat/reject-video-call/${groupId}`);
    return response;
};
