import * as request from '../../utils/axios';

export const blockUserService = async (body) => {
    const response = await request.apiAuth.post('/api/v1/block', body);
    return response;
};

export const unBlockUserService = async (body) => {
    const response = await request.apiAuth.delete('/api/v1/block', { data: body });
    return response;
};

export const getListBlockUserService = async (params) => {
    const response = await request.apiAuth.get('/api/v1/block', { params });
    return response;
};
