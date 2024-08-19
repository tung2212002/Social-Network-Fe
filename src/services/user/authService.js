import * as request from '../../utils/axios';

export const loginService = async (body) => {
    const response = await request.api.post('/api/v1/auth/authentication', body);
    return response;
};

export const checkOptDeviceService = async (body, params) => {
    const response = await request.api.post('/api/v1/device/verify-otp', body, { params });
    return response;
};

export const refreshTokenService = async (body) => {
    const response = await request.apiAuth.post('/api/v1/auth/refresh-token', body);
    return response;
};

export const logoutService = async (body) => {
    const response = await request.apiAuth.post('/api/v1/auth/logout', body);
    return response;
};

export const registerService = async (body) => {
    const response = await request.apiAttach.post('/api/v1/auth/register', body);
    return response;
};

export const checkOptService = async (body) => {
    const response = await request.apiAttach.post('/api/v1/auth/register/check-otp', body);
    return response;
};

export const verifyTokenService = async () => {
    const response = await request.apiAuth.post('/api/v1/auth/verify-token');
    return response;
};

export const changePasswordService = async (body) => {
    const response = await request.apiAuth.post('/api/v1/auth/change-password', body);
    return response;
};

export const forgotPasswordService = async (body) => {
    const response = await request.apiAuth.post('/api/v1/auth/forgot-password', body);
    return response;
};

export const checkOtpForgotPasswordService = async (body) => {
    const response = await request.apiAuth.post('/api/v1/auth/forgot-password/check-otp', body);
    return response;
};
