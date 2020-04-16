import React, { useState, useEffect } from "react";
import { MDBAlert, MDBBtn } from "mdbreact";

import {
  saveTokenToLocal,
  setAuthHeader,
  getAuthUserInfo,
} from "../../config/auth";

import UserService from "../../services/user.service";
import MainLayout from "../../layouts/main-layout/MainLayout";

import MyAlert from "../../components/common/MyAlert";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ResetPassword = (props) => {
  const classes = useStyles();
  const [pass, setpass] = useState("");
  const [repass, setRepass] = useState("");

  const [alert, setAlert] = useState({
    content: "",
    type: "success",
    open: false,
  });

  const user = getAuthUserInfo();
  const [errorMessage, setErrorMessage] = useState("");
  const resetToken = props.match.params.token;

  const [tokenError, setTokenError] = useState("");
  useEffect(() => {
    checkToken();
  }, []);
  async function checkToken() {
    try {
      let res = await UserService.checkToken(resetToken);
    } catch (error) {
      let err;
      if (typeof error.response.data.message == "string") {
        err = error.response.data.message;
      }

      setTokenError(err);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();

    if (resetToken == "") {
      setAlert({
        open: true,
        content:
          "Bạn không có mã xác nhận. Vui lòng gửi lại mail để lấy đường dẫn đặt lại mật khẩu!",
        type: "error",
      });
      closeAlert();
      return;
    }
    try {
      if (repass != pass) {
        setAlert({
          open: true,
          content: "Mật khẩu nhập lại chưa trùng!",
          type: "error",
        });
        closeAlert();
      } else {
        let prt = { password: pass, repassword: repass, token: resetToken };
        const res = await UserService.resetPassword(prt).then((res) => {
          setAlert({
            open: true,
            content: "Lưu thành công",
            type: "success",
          });

          if (res.data.accessToken != null) {
            const { tokenType, accessToken } = res.data;
            const token = tokenType + " " + accessToken;
            saveTokenToLocal(token);
            setAuthHeader(token);

            window.location.href = "/home";
          }
        });
        closeAlert();
      }
    } catch (error) {
      var err;
      if (typeof error.response.data.errors != "undefined") {
        err = error.response.data.errors[0].defaultMessage;
      } else if (typeof error.response.data.message == "string") {
        err = error.response.data.message;
      }
      setAlert({
        open: true,
        content: err,
        type: "error",
      });
      closeAlert();
    }
  }

  const mystyle = {
    textAlign: "center",
    margin: "0 auto",
  };
  ;
  const closeAlert = () =>
    window.setTimeout(() => setAlert({ ...alert, open: false }), 2000);

  return (
    <MainLayout>
      <MyAlert
        open={alert.open}
        setOpen={() => setAlert({ ...alert, open: true })}
        type={alert.type}
        content={alert.content}
      />

      <div style={mystyle}>
        {tokenError == "" ? (
          <>
            <Typography
              component="h3"
              variant="h3"
              style={{ margin: "40px 0px;" }}
            >
              Nhập mật khẩu mới
          
          
          
            </Typography>
          
          
            <form style={mystyle} onSubmit={handleResetPassword}>
              <div className="row">
                <div style={mystyle} className="col-sm-4">
                  {/* //name */}
                  <div className="form-group">
                    {errorMessage}

                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Mật khẩu mới"
                      autoFocus
                      value={pass}
                      type="password"
                      onChange={(e) => setpass(e.target.value)}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Nhập lại mật khẩu mới"
                      value={repass}
                      type="password"
                      onChange={(e) => setRepass(e.target.value)}
                    />
                  </div>

                  {/* //email */}

                  <div className="form-group">
                    <Button color="primary" variant="contained" type="submit">
                      <span className="pl-2 capitalize">Lưu thay đổi</span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
         
         
         
         
          </>
        ) : (
          <Typography
            component="h5"
            variant="h5"
            style={{ margin: "40px 0px;" }}
          >
            {tokenError} <a href="/forgot-password">,gửi lại yêu cầu tại đây!</a>
          </Typography>
        )}
      </div>
    </MainLayout>
  );
};

export default ResetPassword;
