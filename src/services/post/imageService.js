import * as request from '../../utils/axios';

export const upImagePostService = async (body) => {
    const response = await request.apiAuthAttach.post(`/api/v1/posts/images`, body);
    return response;
};

export const upImageCommentService = async (body) => {
    const response = await request.apiAuthAttach.post(`/api/v1/posts/comments/images`, body);
    return response;
};
