import React, { useState, useEffect } from "react";
import { MDBInput, MDBAlert } from "mdbreact";
import { Link } from "react-router-dom";
import UserService from "../../services/user.service";
import { saveTokenToLocal, setAuthHeader, getAuthUserInfo } from '../../config/auth';
import { ROLE_NAMES } from "../../common/constants";
import MyAlert from '../../components/common/MyAlert';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


const LoginPage = () => {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState("");

  const [user, setUser] = useState({ username: '', password: '' });
  const [alert, setAlert] = useState({ open: false, type: 'success', content: '' });

  const changeUser = (prop, value) => setUser({ ...user, [prop]: value });

  const clearForm = () => setUser({ username: '', password: '' });

  const login = async (e) => {
    e.preventDefault();
    try {
      let formatUs= user;
      formatUs.username= formatUs.username.trim()
      const res = await UserService.login(formatUs);

      console.log(res.data);
      if (res.data.accessToken != null) {
        const { tokenType, accessToken } = res.data;
        const token = tokenType + " " + accessToken;
        saveTokenToLocal(token);
        setAuthHeader(token);

        setAlert({
          open: true,
          content: 'Đăng nhập thành công',
          type: 'success'
        });
        closeAlert();
        const userInfo = getAuthUserInfo();

        let url = '/home';
        if (userInfo.role === ROLE_NAMES.ROLE_ADMIN) {
          url = '/admin/users'
        } else if (userInfo.role === ROLE_NAMES.ROLE_SYSTEM_ADMIN) {
          url = '/sysadmin/admin';
        }
        //wait for 400 miliseconds to redirect
        window.setTimeout(() => {
          window.location.href = url;
        }, 400);
      } else if (!res.data.success) {
        setAlert({
          open: true,
          content: 'Đăng nhập không thành công',
          type: 'error'
        });
      }
    } catch (error) {

      var err;
      if (typeof error.response.data.errors != "undefined") {
        err = error.response.data.errors[0].defaultMessage;
      } else if (typeof error.response.data.message == "string") {
        err = error.response.data.message;
      }
      setAlert({
        type: 'error',
        content:err,
        open: true
      });
      
    }
    closeAlert();
  }

  const closeAlert = () => window.setTimeout(() => setAlert({ ...alert, open: false }), 2000);

  return (
    <div className="pt-5">
      {/* <h3 className="text-center text-bold">D</h3> */}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng nhập tài khoản
            </Typography>
          <div> {errorMessage}</div>
          <form className={classes.form} noValidate onSubmit={login}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              value={user.username}
              label="Tên đăng nhập"
              type="usename"
              onChange={e => changeUser("username", e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              value={user.password}
              label="Mật khẩu"
              type="password"
              onChange={e => changeUser("password", e.target.value)}
              type="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Đăng nhập
              </Button>
            <Grid container>
              <Grid item>
                <Link to="/register" variant="body2">
                  {"Đăng kí!"}
                </Link>
              </Grid>
              <Grid item style={{ marginLeft: '10px' }}>
                <Link to="/forgot-password" variant="body2">
                  {"Quên mật khẩu?"}
                </Link>
              </Grid>

            </Grid>
          </form>
        </div>
      </Container>

      <MyAlert
        open={alert.open}
        setOpen={() => setAlert({ ...alert, open: true })}
        type={alert.type}
        content={alert.content}
      />
    </div>
  );
};


export default LoginPage;

