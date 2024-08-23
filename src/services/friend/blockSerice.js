import * as request from '../../utils/axios';

export const blockUserService = async (body) => {
    const response = await request.apiAuth.post('/api/v1/block', body);
    return response;
};
