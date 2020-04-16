import React, { useState, useEffect } from "react";
import MainLayout from "../../../layouts/main-layout/MainLayout";
import { MDBAlert, MDBBtn } from "mdbreact";
import UserService from "../../../services/user.service";
import {
  getAuthUserInfo,
  setAuthHeader,
  getTokenFromLocal,
} from "../../../config/auth";
import MyAlert from "../../../components/common/MyAlert";
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

const ChangePasswordPage = (props) => {
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

  async function handleChangePassword(event) {
    event.preventDefault();
    try {
      if (repass != pass) {
        setAlert({
            open: true,
            content: "Mật khẩu nhập lại chưa trùng. Mời nhập lại!",
            type: "error",
          });
        window.setTimeout(() => {
          closeAlert();
        }, 3000);
        
      }else{
        let pr={password: pass, repassword: repass};
        const res = await UserService.changePassword(pr,user.id ).then((res) => {
            setAlert({
              open: true,
              content: "Lưu thành công",
              type: "success",
            });
          });
          window.setTimeout(() => {
            closeAlert();
          }, 3000);
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
        window.setTimeout(() => {
          closeAlert();
        }, 3000);
     
    }
  }

  const mystyle = {
    textAlign: "center",
    margin: "0 auto",
  };

  const closeAlert = () =>
    window.setTimeout(() => setAlert({ ...alert, open: false }), 3000);

  return (
    <MainLayout>
      <MyAlert
        open={alert.open}
        setOpen={() => setAlert({ ...alert, open: true })}
        type={alert.type}
        content={alert.content}
      />

      <div style={mystyle}>
        <Typography component="h3" variant="h3">
          Đổi mật khẩu
        </Typography>

        <form style={mystyle} onSubmit={handleChangePassword}>
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
              </div>
              <div className="form-group">
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
      </div>
    </MainLayout>
  );
};

export default ChangePasswordPage;
