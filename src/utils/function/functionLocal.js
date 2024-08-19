import {
    getLocalRefreshToken,
    getLocalToken,
    removeAll,
    updateLocalAccessToken,
    removeLocalToken,
    removeLocalUser,
    setLocalToken,
    setLocalUser,
    updateLocalToken,
    updateLocalUserInfo,
    getLocalAccessToken,
} from '../authStorage/authLocalStorage';

const functionLocal = () => {
    return {
        getLocalToken: getLocalToken,
        getLocalAccessToken: getLocalAccessToken,
        getLocalRefreshToken: getLocalRefreshToken,
        removeLocalToken: removeLocalToken,
        removeLocalUser: removeLocalUser,
        removeAll: removeAll,
        setLocalToken: setLocalToken,
        setLocalUser: setLocalUser,
        updateLocalUserInfo: updateLocalUserInfo,
        updateLocalToken: updateLocalToken,
        updateLocalAccessToken: updateLocalAccessToken,
    };
};

export default functionLocal;
