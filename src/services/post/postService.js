import * as request from '../../utils/axios';

export const getPostByIdService = async (id) => {
    const response = await request.apiAuth.get(`/api/v1/posts/${id}`);
    return response;
};

export const createPostService = async (body) => {
    const response = await request.apiAuth.post('/api/v1/posts', body);
    return response;
};

export const upImagePostService = async (body) => {
    console.log(body);
    const response = await request.apiAuthAttach.post(`/api/v1/posts/images`, body);
    return response;
};

export const editPostService = async (id, body) => {
    const response = await request.apiAuth.put(`/api/v1/posts/${id}`, body);
    return response;
};

export const suggestPostSerive = async (params) => {
    const response = await request.apiAuth.get('/api/v1/posts/user/suggest', { params });
    return response;
};

export const deltePostService = async (id) => {
    const response = await request.apiAuth.delete(`/api/v1/posts/${id}`);
    return response;
};
