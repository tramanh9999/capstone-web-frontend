import React, { useContext, useState } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { UserContext } from '../../../context/user.context';
import { ROLE_NAMES } from '../../../common/constants';
import { getAuthUserInfo, isUserAuth, isAdminAuth, isSysAdminAuth, clearTokenFromLocal, setAuthHeader, getTokenFromLocal } from '../../../config/auth';
import UserService from '../../../services/user.service';

const publicRoutes = [
    '/',
    '/home',
    '/login',
    '/register',
    '/stories/search',
    '/stories/details/',
    '/stories/read/',
    '/stories/user/profile/',
];

const userRoutes = [
    '/user/edit-profile',
    '/user/my-profile',
    '/stories/create',
    '/stories/edit/',
    '/user/history',
];

const adminRoutes = [
    '/admin'
];

const sysAdminRoutes = [
    '/sysadmin'
];


const PrivateRoute = ({ component: Component, roleNames, location, ...rest }) => {
    const user = getAuthUserInfo();
    const userAuth = isUserAuth(user);
    const adminAuth = isAdminAuth(user);
    const sysAdminAuth = isSysAdminAuth(user);

    const currentRoute = location.pathname;
    const isAdminRoute = currentRoute.indexOf('/admin') === 0;
    const isSysAdminRoute = currentRoute.indexOf('/sysadmin') === 0;
    const isUserRoute = userRoutes.some(r => currentRoute.indexOf(r) === 0);
    
    return (
        <Route
            {...rest}
            render={props => {
                if((isAdminRoute && adminAuth) 
                || (isSysAdminRoute && sysAdminAuth) 
                || (isUserRoute && (userAuth || adminAuth || sysAdminAuth))){
                    return <Component {...props} />
                } else if((isAdminRoute && !adminAuth) 
                || (isSysAdminRoute && !sysAdminAuth)) {
                    return <Redirect to="/login" />
                } else if((isUserRoute && (!userAuth && !adminAuth && !sysAdminAuth))){
                    return <Redirect to="/home" />;
                }
            }}
        />
    )
};

export default withRouter(PrivateRoute);

