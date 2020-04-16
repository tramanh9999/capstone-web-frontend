import axios from 'axios';
import jwtDecode from 'jwt-decode';
import ValidationUtils from '../utils/validation';
import { ROLE_NAMES } from '../common/constants';

export const setAuthHeader = (token) => {
    if(ValidationUtils.isEmpty(token)){
        axios.defaults.headers.common['Authorization'] = null;
    } else {
        if(token.indexOf('Bearer ') !== 0 ) token = 'Bearer ' + token;
        axios.defaults.headers.common['Authorization'] = token;
    }
}

export const getTokenFromLocal = () => {
    const token = localStorage.getItem('jwt-token');
    return token;
}

export const saveTokenToLocal = (token) => {
    localStorage.setItem('jwt-token', token);
}

export const clearTokenFromLocal = () => {
    localStorage.removeItem('jwt-token');
}

export const getAuthUserInfo = () => {
    let token = getTokenFromLocal();
    // if(token.indexOf('Bearer ') === 0) token = token.substring(7, token.length);
    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        return null;
    }
}

export const interceptResponse = (handleUnauthorizedAction) => {
    axios.interceptors.response.use(function (response) {
    
        return response;
    }, function (error) {
       
        const responseURL = error.request.responseURL;
        // if(responseURL.indexOf('/api/auth/login') > -1 || responseURL.indexOf('/api/auth/change-password') > -1) return Promise.reject(error);
     
        if(!ValidationUtils.isEmpty(error.response)){
            if(error.response.status === 401|| error.response.status===403)
            return handleUnauthorizedAction();
        }
        return Promise.reject(error);
    });
}


export const isUserAuth = (user) => !ValidationUtils.isEmpty(user) && user.role === ROLE_NAMES.ROLE_USER;
    
export const isAdminAuth = (user) => !ValidationUtils.isEmpty(user) && user.role === ROLE_NAMES.ROLE_ADMIN;

export const isSysAdminAuth = (user) => !ValidationUtils.isEmpty(user) && user.role === ROLE_NAMES.ROLE_SYSTEM_ADMIN;
