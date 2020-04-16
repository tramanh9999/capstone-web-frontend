import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/main-layout/MainLayout";
import {
  MDBInput,
  MDBAlert,
  MDBBtn,
  MDBModal,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalBody
} from "mdbreact";
import UserService from "../../services/user.service";

import SplitDate from "../../utils/splitDate";

const UserProfilePage = () => {
  const [posts, setPosts] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [intro_content, setIntro_content] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [jointAt, setJointAt] = useState("");
  const [updateResponse, setUpdateResponse] = useState({
    success: false,
    message: ""
  });

  const [modal, setModal] = useState({
    header: "",
    status: false,
    message: []
  });

  const handleSetGender = (event, value) => {
    setGender(value);
  };

  async function handleUpdateProfile(event) {
    event.preventDefault();
    let user = {
      id: id,
      name: name,
      intro_content: intro_content,
      email: email,
      dob: dob + " " + "00:00:00",
      gender: gender,
      jointAt: jointAt
    };
    try {
      const res = await UserService.updateProfile(user, posts.id);
      setPosts(res.data);

      //thong bao success, còn thông báo err khi bắt đuọc lỗi
      setUpdateResponse({
        success: true,
        message: <MDBAlert color="success">SAVED SUCCESS!</MDBAlert>
      });
    } catch (error) {
      var err;
      //bắt lỗi ở field
      if (typeof error.response.data.errors != "undefined") {
        err = error.response.data.errors[0].defaultMessage;
        //băt lỗi email/username trùng
      } else if (typeof error.response.data.message == "string") {
        err = error.response.data.message;
      }
      //thong bao err
      setUpdateResponse({
        success: false,
        message: <MDBAlert color="danger">{err}</MDBAlert>
      });
    }
  }

  const getPosts = async () => {
    try {
      const res = await UserService.getMyProfile();

      const dobT = res.data.dob;
      res.data.dob = SplitDate.splitDate(dobT);
      setPosts(res.data);
      setEmail(res.data.email);
      setId(res.data.id);
      setName(res.data.name);
      setGender(res.data.gender);
      setIntro_content(res.data.intro_content);
      setDob(res.data.dob);
      setJointAt(res.data.jointAt);
    } catch (error) {}
  };

  //open modal/ close modal
  const toggle = () => {
    setModal({ status: !modal.status });
  };

  useEffect(() => {
    getPosts();
  }, []);

  const statusButton = [];

  if (posts.is_active == true) {
    statusButton.push(<MDBBtn color="success">Active</MDBBtn>);
  } else {
    statusButton.push(<MDBBtn color="danger">Deactivated</MDBBtn>);
  }

  return (
    <MainLayout>
      <div className="container-fluid">
        <div className="row mb-5">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h4> Thông tin tài khoản </h4>{" "}
              </div>{" "}
              <div className="card-body">
                {updateResponse.message}
                <form onSubmit={handleUpdateProfile}>
                  <div className="row">
                    <div className="col-sm-6">
                      <MDBInput
                        label="Tên đầy đủ"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>{" "}
                    <div className="col-sm-6">
                      <MDBInput
                        label="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        outline
                      />
                    </div>{" "}
                    <div className="col-sm-6">
                      <MDBInput
                        value={dob}
                        label="Ngày sinh"
                        type="date"
                        onChange={e => setDob(e.target.value)}
                      />
                    </div>{" "}
                    <div className="col-sm-6">
                      <MDBInput
                        type="textarea"
                        label="Giới thiệu về bản thân"
                        value={intro_content == null ? "" : intro_content}
                        onChange={e => setIntro_content(e.target.value)}
                        outline
                      />
                    </div>
                    <div className="col-sm-6">
                      <MDBBtn color="info" label="Joint at" value={jointAt}>
                        {jointAt}
                      </MDBBtn>
                    </div>{" "}
                    <div className="col-sm-6">{statusButton}</div>{" "}
                    <div className="col-sm-6">
                      <label>Gioi tinh</label> {": " + gender}
                      <br />
                      <input
                        type="radio"
                        name="materialExampleRadios"
                        // checked={gender !== ""?gender==="female": posts.gender==="female" }
                        onChange={e => handleSetGender(e, "male")}
                      />{" "}
                      Nam
                      <input
                        type="radio"
                        name="materialExampleRadios"
                        // checked={gender !== ""?gender==="male": posts.gender==="male"}
                        onChange={e => handleSetGender(e, "female")}
                      />{" "}
                      Nu
                    </div>
                    <button
                      className="btn btn-success float-right"
                      style={{ fontSize: "1.1em" }}
                    >
                      Save
                    </button>{" "}
                    <MDBModal isOpen={modal.status} toggle={toggle}>
                      <MDBModalHeader toggle={toggle}>
                        {modal.header}
                      </MDBModalHeader>
                      <MDBModalBody>
                        {JSON.stringify(modal.message)}
                      </MDBModalBody>
                      <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={toggle}>
                          Close
                        </MDBBtn>
                      </MDBModalFooter>
                    </MDBModal>
                  </div>
                </form>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>
        <h3 className="text-bold"> Truyen cua ban </h3>{" "}
        <hr style={{ border: "1px solid #ccc" }} />{" "}
        <div className="row">
          {" "}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
            <div className="col-8">
              <div className="card mb-3">
                <div className="row no-gutters">
                  <div className="col-md-4">
                    <img
                      src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg"
                      className="card-img"
                    />
                  </div>{" "}
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title"> Truyen ma nua dem </h5>{" "}
                      <p className="card-text">
                        {" "}
                        This is a story inro content...{" "}
                      </p>{" "}
                      <div>
                        <button className="btn btn-warning float-right">
                          {" "}
                          Edit{" "}
                        </button>{" "}
                        <button className="btn btn-success float-right mr-0">
                          {" "}
                          Publish{" "}
                        </button>{" "}
                        <button className="btn btn-danger float-right mr-0">
                          {" "}
                          Deactivate{" "}
                        </button>
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </MainLayout>
  );
};

export default UserProfilePage;
