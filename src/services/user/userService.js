import * as request from '../../utils/axios';

export const setProfileStateService = async (body) => {
    const response = await request.put('/api/v1/profiles/state', body);
    return response;
};

export const getUserService = async (id) => {
    const response = await request.apiAuth.get(`/api/v1/profiles/${id}`);
    return response;
};

export const updateProfileService = async (body) => {
    const response = await request.apiAuth.put('/api/v1/profiles', body);
    return response;
};

export const changeAvatarService = async (body) => {
    const response = await request.apiAuthAttach.put('/api/v1/profiles/avatar', body);
    return response;
};

export const changeBackgroundService = async (body) => {
    const response = await request.apiAuthAttach.put('/api/v1/profiles/background', body);
    return response;
};

export const setStatePrivacyService = async (body) => {
    const response = await request.apiAuth.put('/api/v1/profiles/privacy', body);
    return response;
};

export const searchUserService = async (params) => {
    const response = await request.apiAuth.get('/api/search/user', { params });
    return response;
};
