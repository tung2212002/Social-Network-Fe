import axios from 'axios';

import { API_URL } from '../configs';
import functionLocal from './function/functionLocal';

const instance = (config = {}, auth = false) => {
    const { getLocalAccessToken, getLocalRefreshToken, updateLocalAccessToken, removeAll } = functionLocal();
    const request = axios.create(config);
    request.interceptors.request.use(
        async (requestConfig) => {
            if (auth) {
                // const token = getLocalAccessToken();
                let token =
                    'eyJhbGciOiJIUzI1NiJ9.eyJmaW5nZXJwcmludGluZyI6IjIzMTIzMTI0MzEyNCIsInN1YiI6IjlAZ21haWwuY29tIiwiaWF0IjoxNzI0NjU5MDQ5LCJleHAiOjE3MjQ3NDU0NDl9.plCxUIiooUbRzvF3Lp_zpnE3HN64mX3OCvi2uHyLihs';
                if (token) {
                    requestConfig.headers.Authorization = `Bearer ${token}`;
                }
            }
            requestConfig.timeout = 100000;

            if (requestConfig.customHeaders) {
                requestConfig.headers = { ...requestConfig.headers, ...requestConfig.customHeaders };
            }

            return requestConfig;
        },
        (error) => {
            return Promise.reject(error);
        },
    );
    request.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const refreshToken = getLocalRefreshToken();
                const url = '/api/v1/auth/refresh-token';
                if (refreshToken) {
                    return axios
                        .post(
                            url,
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${refreshToken}`,
                                    'Content-Type': 'application/json',
                                },
                            },
                        )
                        .then((res) => {
                            if (res.status === 200) {
                                const token = res.data.data.access_token;
                                updateLocalAccessToken(token);
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                                return axios(originalRequest);
                            }
                        })
                        .catch((error) => {
                            removeAll();
                            return Promise.resolve({ status: error.response.status, data: error.response.data });
                        });
                } else {
                    return Promise.resolve({ status: error.response.status, data: error.response.data });
                }
            }
            return Promise.resolve({ status: error.response?.status || 500, data: error.response?.data || {} });
        },
    );

    return request;
};

export const api = instance({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
    },
});

export const apiAuth = instance(
    {
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
        },
    },
    true,
);

export const apiAttach = instance({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
        Accept: '*/*',
    },
});

export const apiAuthAttach = instance(
    {
        baseURL: API_URL,
        headers: {
            'Content-Type': 'multipart/form-data',
            Accept: '*/*',
        },
    },
    true,
);
