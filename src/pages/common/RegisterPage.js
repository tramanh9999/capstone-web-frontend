import React, { useState } from "react";
import { MDBAlert } from "mdbreact";
import UserService from "../../services/user.service";
// import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from "@material-ui/core/Avatar";

import '../../style/postion.css'
import '../../style/spacing.css'
import '../../style/signup.css'
import {
  Grid,
  Button
} from "@material-ui/core";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const RegisterPage = () => {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [intro_content, setintro_content] = useState("");
  const [alert, setAlert] = useState({ open: false, type: 'success', content: '' });

  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    let randomImage =
      "https://avatars.dicebear.com/v2/avataaars/" +
      username +
      ".svg" +
      "?options[mood][]=happy&options[mouth][]=smile&options[accessories][]=sunglasses";

    let user = {
      name: name.trim(),
      username: username.trim(),
      password: password,
      intro_content: intro_content.trim(),
      email: email.trim(),
      avatar: randomImage
    };

    try {
      const res = await UserService.register(user);
      if (res.data.success == true) {
        setErrorMessage(
          <MDBAlert color="success">{res.data.message}</MDBAlert>
        );
        window.setTimeout(() => {
          window.location.href = "/login";
        }, 400);
      }
    } catch (error) {
      var err;
      if (typeof error.response.data.errors != "undefined") {
        err = error.response.data.errors[0].defaultMessage;
      } else if (typeof error.response.data.message == "string") {
        err = error.response.data.message;
      }
      setErrorMessage(<MDBAlert color="danger">{err}</MDBAlert>);
    }
  }
  const closeAlert = () => window.setTimeout(() => setAlert({ ...alert, open: false }), 3000);

  return (   
    <div className="py-5">
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Đăng kí tài khoản
            </Typography>
            {errorMessage}
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    type="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    label="Tên đăng nhập"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    value={name}
                    label="Tên đầy đủ"
                    onChange={e => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    type="email"
                    label="Email"
                    onChange={e => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    value={password}
                    type="password"
                    label="Mật khẩu"
                    onChange={e => setPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    multiline
                    fullWidth
                    rows="3"
                    value={intro_content}
                    label="Thông tin giới thiệu về bạn..."
                    onChange={e => setintro_content(e.target.value)}
                  />
                </Grid>

              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Đăng ký
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link to="/login">
                    Nếu bạn đã có tài khoản? Vui lòng đăng nhập tại đây
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>

        </Container>

    </div>
  );
};

export default RegisterPage;
