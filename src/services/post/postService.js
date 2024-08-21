import * as request from '../../utils/axios';

export const createPostService = async (body) => {
    const response = await request.apiAuth.post('/api/v1/posts', body);
    return response;
};

export const upImagePostService = async (body) => {
    const response = await request.apiAuthAttach.post(`/api/v1/posts/images`, body);
    return response;
};

export const suggestPostSerive = async (body) => {
    const response = await request.apiAuth.get('/api/v1/posts/user/suggest', body);
    return response;
};
