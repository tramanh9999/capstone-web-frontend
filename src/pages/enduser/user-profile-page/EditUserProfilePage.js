import React, { useState, useEffect } from "react";
import MainLayout from "../../../layouts/main-layout/MainLayout";
import { MDBAlert, MDBBtn } from "mdbreact";
import UserService from "../../../services/user.service";
import { getAuthUserInfo, setAuthHeader, getTokenFromLocal } from "../../../config/auth";
import MyAlert from "../../../components/common/MyAlert";
import UploadImage from "../../../components/common/UploadImage";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import SendIcon from "@material-ui/icons/Send";

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
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const EditUserProfilePage = props => {
  const classes = useStyles();
  const [profile, setProfile] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [us, setUs] = useState("");
  const [email, setEmail] = useState("");
  const [intro_content, setIntro_content] = useState("");
  const [jointAt, setJointAt] = useState("");
  const [is_active, setIsActive] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [avatar, setAvatar] = useState("");
  const [upfile, setUploadFile] = useState(null);
  const [banner, setBanner] = useState("");
  const [upfileBanner, setUploadFileBanner] = useState(null);
  const [saveAvatarBt, setSaveAvatarBt] = useState("disabled");
  const [saveBannerBt, setSaveBannerBt] = useState("disabled");
  const [story, setStory] = useState(null);

  const [alert, setAlert] = useState({
    content: "",
    type: "success",
    open: false
  });

  const [dialog, setDialog] = useState({ content: "", open: false });
  const user = getAuthUserInfo();

  useEffect(() => {
    getProfile();
  }, []);

  async function handleUpdateProfile(event) {
    event.preventDefault();
    let user = {
      id: id,
      username: us,
      name: name,
      intro_content: intro_content,
      email: email,
      jointAt: jointAt
    };
    try {
      const res = await UserService.updateProfile(user, profile.id);
      setProfile(res.data);
      setAlert({
        open: true,
        content: "Lưu thành công",
        type: "success"
      });
      window.setTimeout(() => {
        closeAlert();
      }, 3000);
    } catch (error) {

      var err;
      if (typeof error.response.data.errors != "undefined") {
        err = error.response.data.errors[0].defaultMessage;
      } else if (typeof error.response.data.message == "string") {
        err = error.response.data.message;
      }
      setAlert({
        open: true,
        content: { err },
        type: "error"
      });
      window.setTimeout(() => {
        closeAlert();
      }, 3000);
    }
  }

  const getProfile = async () => {
    try {
      setAuthHeader(getTokenFromLocal());
      const res = await UserService.getMyProfile();
      console.log(res.data);

      setProfile(res.data);
      setEmail(res.data.email);
      setAvatar(res.data.avatar);
      console.log(avatar);
      setId(res.data.id);
      setName(res.data.name);
      setUs(res.data.username);
      setIntro_content(res.data.intro_content);
      var date = new Date(res.data.jointAt);

      setJointAt(date.toString());
      setIsActive(res.data.is_active);
      setBanner(res.data.profileImage);
    } catch (error) {
      console.log(error);
    }
  };
  const mystyle = {
    textAlign: "center",
    margin: "0 auto"
  };
  const statusButton = [];
  statusButton.push(
    <MDBBtn
      style={{ padding: 0 }}
      color={profile.active ? "success" : "danger"}
    >
      {profile.active ? "Active" : "Deactivated"}
    </MDBBtn>
  );
  const closeAlert = () => window.setTimeout(() => setAlert({ ...alert, open: false }), 3000);
  return (
    <MainLayout>
      <MyAlert
        open={alert.open}
        setOpen={() => setAlert({ ...alert, open: true })}
        type={alert.type}
        content={alert.content}
      />
      {errorMessage}

      <div style={mystyle}>
        <Typography component="h1" variant="h4">
          Tài khoản
        </Typography>
        <div className="col-sm-12">
     
         <UploadImage 
         isBanner = 'banner'
         Idis ={id}
         imageBanner={banner}
         imageAvatar= ''
         />
 

         <UploadImage 
         isBanner = 'avatar'
         Idis ={id}
         imageAvatar={avatar}
         imageBanner= ''
         />
        </div>

        <hr style={{ border: "1px solid #ccc" }} />
        <form style={mystyle} onSubmit={handleUpdateProfile}>
          <div className="row">
            <div style={mystyle} className="col-sm-6">
              {/* //name */}
              <div className="form-group">
                {/* <label htmlFor="name">
                  <strong>Tên của bạn</strong>
                </label> */}
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Tên của bạn"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              {/* //username */}
              <div className="form-group">
                {/* <label htmlFor="username">
                  <strong>Tên đăng nhập</strong>
                </label> */}

                {/* <input
                  type="text"
                  id="username"
                  value={us}
                  outline
                  className="form-control"
                  onChange={e => setUs(e.target.value)}
                /> */}
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Tên đăng nhập"
                  
                  value={us}
                  onChange={e => setUs(e.target.value)}
                />
              </div>
              {/* //email */}
              <div className="form-group">
                {/* <label htmlFor="email">
                  <strong>Email</strong>
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  outline
                  className="form-control"
                  onChange={e => setEmail(e.target.value)}
                /> */}

                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Email"
                  
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="intro_content">
                  Giới thiệu cho mọi người về bạn
                </label>
                <textarea
                  id="intro_content"
                  value={intro_content == null ? "" : intro_content}
                  outline
                  
                  className="form-control text-area"
                  onChange={e => setIntro_content(e.target.value)}
                />
              </div>
              {/* save button */}
              <div className="form-group">
                <Button color="primary" variant="contained" type="submit">
                  <SendIcon />
                  <span className="pl-2 capitalize">Lưu thay đổi</span>
                </Button>

                {/* <button
                      className="btn float-left"
                      style={{
                        clear: "both",
                        fontSize: "1.1em",
                        margin: 0,
                        color: "#fff",
                        backgroundColor: "#007bff"
                      }}
                    >
                      Lưu thay đổi
                    </button> */}
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditUserProfilePage;
