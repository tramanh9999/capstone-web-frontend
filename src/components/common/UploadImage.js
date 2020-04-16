import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import FileService from "../../services/file.service";
import Button from "@material-ui/core/Button";
import MyAlert from "./MyAlert";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const UploadImage = ({ isBanner, Idis, imageBanner="", imageAvatar="" }) => {

  let checkimage = null;

  const [avatar2, setAvatar2] = useState(imageAvatar);
  const [upfile, setUploadFile] = useState(null);
  const [banner2, setBanner2] = useState(imageBanner);
  const [upfileBanner, setUploadFileBanner] = useState(null);
  const [saveAvatarBt, setSaveAvatarBt] = useState("disabled");
  const [saveBannerBt, setSaveBannerBt] = useState("disabled");
  const [alert, setAlert] = useState({
    content: "",
    type: "success",
    open: false,
  });
  const onchange = async (file) => {
  
    var reader = new FileReader();
    if (isBanner === "banner") {
      setUploadFileBanner(file);
      reader.onload = function (e) {
        setBanner2(e.target.result);
          console.log(imageBanner)
      };
    if(file!= null){

      reader.readAsDataURL(file);
      setSaveBannerBt("");
    }
    } else {
      setUploadFile(file);
      reader.onload = function (e) {
        setAvatar2(e.target.result);
      };
      if(file!= null){
        reader.readAsDataURL(file);
      setSaveAvatarBt("");
    }

   
    }
  };
  const handleUpload = async (event) => {
    event.preventDefault();
    try {
      let res = null;
      let flag = "";
      if (isBanner === "avatar") {
        res = await FileService.uploadImage(upfile);
        flag = "avatar";
        console.log(res);
      } else if (isBanner === "banner") {
        res = await FileService.uploadImage(upfileBanner);
        flag = "image";
        console.log(res);
      }
      if (res.data.status == 200) {
        let linkImgur = res.data.data.link;
        try {
          if (isBanner === "avatar") {
            console.log(Idis);
            const r2 = await UserService.saveToDatabase(Idis, linkImgur);
          } else if (isBanner === "banner") {
            const r2 = await UserService.saveToDatabaseProfileImage(
              Idis,
              linkImgur
            );
          }
          setAlert({
            open: true,
            content: "Đã cập nhật thành công.!",
            type: "success",
          });
          window.setTimeout(() => {
            closeAlert();
          }, 3000);
        } catch (error) {
          setAlert({
            open: true,
            content: "Lưu thất bại. Thử lại!",
            type: "error",
          });
          window.setTimeout(() => {
            closeAlert();
          }, 3000);
        }
      }
    } catch (error) {
      setAlert({
        open: true,
        content: "Upload thất bại. Thử lại!",
        type: "error",
      });
      window.setTimeout(() => {
        closeAlert();
      }, 3000);
    }
  };

  const mystyle = {
    textAlign: "center",
    margin: "0 auto",
  };
  const mystyleLeft = {
    textAlign: "left",
    paddingTop: "200px",
    margin: "0 auto",
  };
  const mystyleRight = {
    textAlign: "right",
    margin: "0 auto",
  };


  
  const closeAlert = () =>
    window.setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    console.log(imageAvatar)
    


    if (isBanner == "banner") { 
    return (
      <div style={mystyleRight}>
        <form
          style={mystyle}
          onSubmit={handleUpload}
          encType="multipart/form-data"
        >
          <MyAlert
            open={alert.open}
            setOpen={() => setAlert({ ...alert, open: true })}
            type={alert.type}
            content={alert.content}
          />
          <div className="row">
            {/* //avatar */}
            <div className="form-group field banner">
              <div className="banner-container">
                {/* <label htmlFor="banner1">hình nền</label> */}
                <div className="banner-600">
                  <img id="banner1" name="banner1" src={banner2!=""?banner2:imageBanner} width="200" />
                </div>
              </div>
              <div className="control">
                <input
                  type="file"
                  name="image"
                  accept=".jpg, .gif, .png"
                  onChange={(e) => onchange(e.target.files[0])}
                />
                <p className="tips">JPG, GIF or PNG, Dung lượng tối đa: 10MB</p>
                <div className="form-group">
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={saveBannerBt}
                  >
                    <CloudUploadIcon />
                    <span className="pl-2 capitalize">Lưu Hình Nền</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  } else if (isBanner === "avatar") {
    return (
      <div style={mystyleLeft}>
        <form
          style={mystyle}
          onSubmit={handleUpload}
          encType="multipart/form-data"
        >
          <MyAlert
            open={alert.open}
            setOpen={() => setAlert({ ...alert, open: true })}
            type={alert.type}
            content={alert.content}
          />

          <div className="row">
            {/* //avatar */}
            <div style={mystyle} className="form-group field avatar">
              <div className="avatar-container">
    <label htmlFor="avatar1">Avatar </label>
                <div className="avatar-80">
                  <img id="avatar1" name="avatar1" src={avatar2!=""? avatar2:imageAvatar} width="80" />
                </div>
              </div>
              <div className="control">
                <input
                  type="file"
                  name="image"
                  accept=".jpg, .gif, .png"
                  onChange={(e) => onchange(e.target.files[0])}
                />
                <p className="tips">JPG, GIF or PNG, Dung lượng tối đa: 10MB</p>
                <div className="form-group">
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={saveAvatarBt}
                  >
                    <CloudUploadIcon />
                    <span className="pl-2 capitalize">Lưu avatar</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
       
        </form>
      </div>
    );
  }
};

export default UploadImage;
