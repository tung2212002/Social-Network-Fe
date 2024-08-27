import * as request from '../../utils/axios';

export const searchService = async (k) => {
    const response = await request.apiAuth.get(`/api/search?q=${k}`);
    return response;
};

export const searchFriendService = async (k) => {
    const response = await request.apiAuth.get(`/api/search/friend?q=${k}`);
    return response;
};
