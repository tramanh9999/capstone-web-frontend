import React, { useState, useEffect } from 'react';
import { getAuthUserInfo } from '../config/auth';
import ValidationUtils from '../utils/validation';
import { ROLE_NAMES } from '../common/constants';

export const UserContext = React.createContext();

export const UserProvider = (props) => {
   
    const [user, setUser] = useState({});

    useEffect(() => {   
        const userInfo = getAuthUserInfo();
       
        if(ValidationUtils.isEmpty(userInfo) || ValidationUtils.isEmpty(userInfo.username)){
            setUser(null);
        } else {
            setUser({
                username: userInfo.username,
                name: userInfo.name,
                role: userInfo.role,
            })
        }
    }, []);
    
   
    const state = { user };
    const methods = { setUser };

    return (
        <UserContext.Provider value={{
            ...state,
            ...methods
        }}>
            { props.children }
        </UserContext.Provider>
    )
}