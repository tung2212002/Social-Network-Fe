import * as request from '../../utils/axios';

export const upImagePostService = async (body) => {
    const response = await request.apiAuthAttach.post(`/api/v1/posts/images`, body);
    return response;
};
