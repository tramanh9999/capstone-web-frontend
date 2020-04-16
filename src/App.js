import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { withStyles } from "@material-ui/core/styles";
import './App.css';

import GlobalContext from './context';

import HomePage from './pages/enduser/home-page/HomePage';
import StoryReadingPage from './pages/enduser/story-reading-page/StoryReadingPage';
import CreateStoryPage from './pages/enduser/create-story-page/CreateStoryPage';
import SearchStoriesPage from './pages/enduser/search-stories-page/SearchStoriesPage';
import StoryDetailsPage from './pages/enduser/story-details-page/StoryDetailsPage';
import UserProfilePage from './pages/enduser/user-profile-page/UserProfilePage';
import PublicUserProfilePage from './pages/enduser/user-profile-page/PublicUserProfilePage';
import UserHistoryPage from './pages/enduser/user-history-page/UserHistoryPage';
import EditUserProfilePage from './pages/enduser/user-profile-page/EditUserProfilePage';
import ChangePasswordPage from './pages/enduser/user-profile-page/ChangePasswordPage';

import LoginPage from './pages/common/LoginPage';
import ResetPassword from './pages/common/ResetPassword';
import EmailSubmitPage from './pages/common/EmailSubmitPage';
import RegisterPage from './pages/common/RegisterPage';

import UserManagementPage from './pages/admin/UserManagementPage';

import StoryManagementPage from './pages/admin/StoryManagementPage';
import StoryAnalytic from './pages/admin/StoryAnalytic';
import TagManagementPage from './pages/admin/TagManagementPage';
import ReportManagementPage from './pages/admin/ReportManagementPage';
import AdminManagementPage from './pages/admin/AdminManagementPage';
import NotFoundPage from './pages/common/NotFoundPage';

import PrivateRoute from './pages/common/auth/PrivateRoute';

import { getTokenFromLocal, setAuthHeader, interceptResponse, clearTokenFromLocal } from './config/auth';
import ValidationUtils from './utils/validation';


const styles = theme => ({
  "@global": {
    html: {
      fontSize: 16,
    }
  }
});

let isSetupAuth = false;

function App() {

  if(!isSetupAuth){
    //get token from local-storage when user access the website
    const token = getTokenFromLocal();
    if(ValidationUtils.isEmpty(token)){
      setAuthHeader(null);
    } else {
      setAuthHeader(token);
    }

    // redirect to login page when response status is 401 or 403
    interceptResponse(() => {
      setAuthHeader(null);
      clearTokenFromLocal();
      window.location.href = '/login';
    });

    isSetupAuth = true;
  }

  return (
    <GlobalContext>
      <Router>
        <Switch>
            {/* common routes */}
            <Route exact path="/login" component={LoginPage}/>
            <Route exact path="/register" component={RegisterPage}/>

            {/* user routes */}
            <Route exact path="/" component={HomePage}/>
            <Route exact path="/home" component={HomePage}/>
            <Route exact path="/stories/search" component={SearchStoriesPage}/>
            <Route exact path="/stories/details/:storyId" component={StoryDetailsPage}/>
            <Route exact path="/stories/read/:storyId" component={StoryReadingPage}/>
            <Route exact path="/user/profile/:userId" component={PublicUserProfilePage}/>
            <Route exact path="/story/analystics/:storyId" component={StoryAnalytic}/>
            <Route exact path="/forgot-password" component={EmailSubmitPage}/>
            <Route exact path="/reset-password/token/:token" component={ResetPassword}/>
            <Route 
              exact 
              path="/user/settings/password" 
              component={ChangePasswordPage}/>
            <PrivateRoute 
              exact 
              path="/stories/create" 
              component={CreateStoryPage}/>

            <PrivateRoute 
              exact 
              path="/stories/edit/:storyId" 
              component={CreateStoryPage}/>

            <PrivateRoute
              exact 
              path="/user/my-profile/:storyId"
              component={CreateStoryPage}/>

            <PrivateRoute
              exact
              path="/user/my-profile"
              component={UserProfilePage}/>

            <PrivateRoute
              exact
              path="/user/edit-profile"
              component={EditUserProfilePage}/>
           
            <PrivateRoute 
              exact 
              path="/user/history" 
              component={UserHistoryPage}/>


            {/* system admin routes */}
            <PrivateRoute exact path="/sysadmin/admin" component={AdminManagementPage}/>


            {/* admin routes */}            
            <Route exact path="/admin" render={() => <Redirect to="/admin/users" /> } />
            <PrivateRoute exact path="/admin/users" component={UserManagementPage}/>
            <PrivateRoute exact path="/admin/stories" component={StoryManagementPage}/>
            <PrivateRoute exact path="/admin/tags" component={TagManagementPage}/>
            <PrivateRoute exact path="/admin/reports" component={ReportManagementPage}/>
            

            {/* other routes */}
            <Route component={NotFoundPage}/>
            <Route exact path="/notfound" component={NotFoundPage}/>
        </Switch>
      </Router>
    </GlobalContext>
  );
  }


export default withStyles(styles)(App);
