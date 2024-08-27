import * as request from '../../utils/axios';

export const getListCommentByPostIdService = async (id, params) => {
    const response = await request.apiAuth.get(`/api/v1/posts/${id}/comments`, { params });
    return response;
};

export const getListCommentChildByCommentIdService = async (id, params) => {
    const response = await request.apiAuth.get(`/api/v1/posts/comments/${id}/replies`, { params });
    return response;
};

export const reactionCommentService = async (id, body) => {
    const response = await request.apiAuth.post(`/api/v1/reaction/comment/${id}`, body);
    return response;
};

export const createCommentService = async (body) => {
    const response = await request.apiAuth.post('/api/v1/posts/comments', body);
    return response;
};

export const createCommentChildService = async (id, body) => {
    const response = await request.apiAuth.post(`/api/v1/posts/comments/${id}`, body);
    return response;
};

export const editCommentService = async (id, body) => {
    const response = await request.apiAuth.put(`/api/v1/posts/comments/${id}`, body);
    return response;
};

export const deleteCommentService = async (id) => {
    const response = await request.apiAuth.delete(`/api/v1/posts/comments/${id}`);
    return response;
};
