import { getLocalItem, setLocalItem, updateLocalItem, removeLocalItem } from '../../utils/localStorageUtils';

const USER_TOKEN_KEY = 'token';
const USER_KEY = 'user';

const getLocalToken = () => getLocalItem(USER_TOKEN_KEY);

const getLocalRefreshToken = () => getLocalToken()?.refreshToken;

const getLocalAccessToken = () => getLocalToken()?.accessToken;

const setLocalToken = (token) => setLocalItem(USER_TOKEN_KEY, token);

const updateLocalAccessToken = (token) => {
    updateLocalItem(USER_TOKEN_KEY, { accessToken: token });
};

const updateLocalToken = (token) => setLocalToken(token);

const getLocalUser = () => getLocalItem(USER_KEY);

const setLocalUser = (user) => setLocalItem(USER_KEY, user);

const updateLocalUserInfo = (user) => {
    updateLocalItem(USER_KEY, user);
};

const removeLocalToken = () => removeLocalItem(USER_TOKEN_KEY);

const removeLocalUser = () => removeLocalItem(USER_KEY);

const removeAll = () => {
    removeLocalToken();
    removeLocalUser();
};

export {
    getLocalToken,
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    setLocalToken,
    updateLocalToken,
    updateLocalUserInfo,
    getLocalUser,
    setLocalUser,
    removeLocalToken,
    removeLocalUser,
    removeAll,
};
