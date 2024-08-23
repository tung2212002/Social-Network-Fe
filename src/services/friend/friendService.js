import * as request from '../../utils/axios';

export const getSuggestFriendService = async (params) => {
    const response = await request.apiAuth.get('/api/v1/friends/suggest', { params });
    return response;
};
