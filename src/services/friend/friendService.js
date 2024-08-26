import * as request from '../../utils/axios';

export const getSuggestFriendService = async (params) => {
    const response = await request.apiAuth.get('/api/v1/friends/suggest', { params });
    return response;
};

export const searchFriendService = async (params) => {
    const response = await request.apiAuth.get('/api/search/friend', params);
    return response;
};

export const getFriendListService = async (params) => {
    const response = await request.apiAuth.get('/api/v1/friends', { params });
    return response;
};

export const requestFriendService = async (body) => {
    const response = await request.apiAuth.post('/api/v1/friends', body);
    return response;
};

export const acceptFriendService = async (body) => {
    const response = await request.apiAuth.post('/api/v1/friends/accept', body);
    return response;
};

export const updateFriendService = async (body) => {
    const response = await request.apiAuth.put('/api/v1/friends', body);
    return response;
};

export const deleteFriendService = async (body) => {
    const response = await request.apiAuth.delete('/api/v1/friends', { data: body });
    return response;
};
