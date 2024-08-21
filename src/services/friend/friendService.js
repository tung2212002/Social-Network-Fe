import * as request from '../../utils/axios';

export const createPostService = async (body) => {
    const response = await request.apiAuth.post('/api/v1/posts', body);
    return response;
};
