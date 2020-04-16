import React, { useState, useEffect, useRef } from 'react';
import MainLayout from "../../layouts/main-layout/MainLayout";
import TagService from "../../services/tag.service";
import axios from "axios";
import DateTimeUtils from '../../utils/datetime';

import MyAlert from '../../components/common/MyAlert';

import {
  MDBDataTable, MDBNotification, MDBContainer, MDBRow,MDBCol,
  MDBModal, MDBBtn, MDBModalHeader, MDBModalFooter, MDBModalBody,
  MDBDropdownItem, MDBInput, MDBDropdownToggle, MDBDropdown, MDBDropdownMenu,
  MDBBadge, MDBCard
} from "mdbreact";

class TagManagementPage extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  state = {
    data: [],
    visible: false,
    visible2: false,
    visible3: false,
    isactive: false,
    status: "",
    currId: "",
    title: "",
    loading: false,

    open: false,
    content: '',
    type: ''
    

  };

  showModal = () => {
    this.setState({ visible: true });
  };
  showModal2 = () => {
    this.setState({ visible2: true });
  };
  showModal3 = () => {
    this.setState({ visible3: true });
  };

  handleIdtoUpdate(id) {
    this.showModal2();
    this.setState({ currId: id });
  }

  handleIdtoChange(id, title) {
    this.showModal3();
    this.setState({ currId: id });
    this.setState({ title: title });
  }

  handleChange(e) {
    this.setState({ title: e.target.value });
  }

  openAleart(e) {
    this.setState({ open: true });
  }
  closeAleart(e) {
    this.setState({ open: false });
  }

  handleCancel = () => {
    this.setState({ visible: false });
    this.setState({ visible2: false });
    this.setState({ visible3: false });
  };
  loadData = () => {
   TagService.getAllTag().then(res => {
      this.setState({ data: res.data.content });
      this.setState({ loading: true });
      this.wait();
    }).catch(error => {
      console.log(error);
    });
  };

  componentDidMount() {
    this.loadData();
  }

  wait() {
    setTimeout(() => {
      this.closeAleart()
    }, 2000);
  };


  handleSubmit = e => {
    let tag = { title: this.state.title };
    
    TagService.addTag(tag).then(res => {
      this.setState({
        open: true,
        content: 'Thêm Mới Thành Công',
        type: 'success'
      });
      this.setState({ visible: false });
      this.setState({ status: "", currId: "", title: "" });
      this.loadData();
      this.wait();
    }).catch(error => {
      console.log(error);
      this.setState({
        open: true,
        content: 'Thêm Mới Thất Bại',
        type: 'error'
      });
      this.wait();
    })
    
  };

  handleSubmitUpdate = e => {
    let id = this.state.currId;
    let titles = this.state.title;
    let ac = this.state.isactive;
    let isUpdate = false;
    if (ac === null) {
      isUpdate = true;
    }
    let status = false;
    if (ac === true) {
      status = true;
    } else if (ac === false) {
      status = false;
    }
    let tag = {
      id: id,
      title: titles,
      active: status,
      isUpdate: isUpdate
    };
     TagService.updateTag(tag).then(res => {
      this.setState({
        open: true,
        content: 'Cập Nhật Thành Công',
        type: 'success'
      });
      this.setState({ visible3: false });
      this.setState({ status: "", currId: "", title: "" });
      this.loadData();
      this.wait();
    }).catch(error => {
      console.log(error);
      this.setState({
        open: true,
        content: 'Cập Nhật Thất Bại',
        type: 'error'
      });
      this.wait();
     
    });
  };

  renderTab(arr) {
    return arr.map(({ id, title, createdAt, updatedAt, active }) => {
      let check = "";
      if (active === "Enable") {
        check = "primary";
      } else if (active === "Deactive") {
        check = "danger";
      }
      return {
        rows: [
          {
            title: <MDBBadge color="default">{title}</MDBBadge>,
            updatedAt: (
              <div>{ DateTimeUtils.getDateTime(updatedAt) }</div>
            ),
            active: <MDBBadge color="primary">{active}</MDBBadge>,
            status: (
              <MDBBtn
                onClick={e => this.handleIdtoChange(id, title)}
                color="purple"
                size="sm"
              >
                Cập Nhật Thẻ
              </MDBBtn>
            )
          }
        ]
      };
    });
  }

  render() {
    const { data } = this.state;


    //
    data.map((dat, index) => {
      if (dat.active === true) {
        dat.active = "Kích Hoạt";
      } else if (dat.active === false) {
        dat.active = "Không Kích Hoạt";
      }
    });

    //
    const { visible } = this.state;
    const { visible2 } = this.state;
    const { visible3 } = this.state;
    const { currId } = this.state;
    const { loading } = this.state;

    const datamax = {
      columns: [
        {
          label: "Tên Thẻ",
          field: "title",
          width: "30%",
          sort: "asc"
        },
        {
          label: "Ngày Cập Nhật",
          field: "updatedAt",
          width: "10%",
          sort: "asc"
        },

        {
          label: "Tình Trạng",
          field: "active",
          width: "10%",
          sort: "asc"
        },
        {
          label: "Hành Động",
          field: "status",
          width: "10%"
        }
      ],
      rows: []
    };

    for (let i = 0; i < data.length; i++) {
      datamax.rows.push(this.renderTab(data)[i].rows[0]);
    }

    return (
      <MainLayout>
        <MDBContainer>
          <MDBCard>
            <MDBRow type="flex" justify="start">
            </MDBRow>
            <br />
            <br />
            <hr className="my-5" />
            <div>
              <MDBBtn
                className="mr-md-n8 ml-5"
                rounded
                onClick={e => this.showModal(e)}
              >
                Thêm Thẻ
              </MDBBtn>
            </div>

            <MDBModal isOpen={visible}>
              <MDBModalHeader
                className="text-center"
                titleClass="w-100 font-weight-bold"
                toggle={e => this.showModal(e)}
              >
                Thêm Thẻ
              </MDBModalHeader>
              <MDBModalBody>
                <form className="mx-3 grey-text">
                  <MDBInput
                    label="Nhập vào tên nhãn"
                    icon="fas fa-hashtag"
                    value={this.state.title}
                    onChange={e => this.handleChange(e)}
                    validate
                    error="wrong"
                    success="right"
                  />
                </form>
              </MDBModalBody>
              <MDBModalFooter className="justify-content-center">
                <MDBBtn onClick={e => this.handleSubmit(e)}>Thêm Thẻ</MDBBtn>

                <MDBBtn onClick={e => this.handleCancel(e)}>Thoát</MDBBtn>
              </MDBModalFooter>
            </MDBModal>

            <MDBModal isOpen={visible3}>
              <MDBModalHeader
                className="text-center"
                titleClass="w-100 font-weight-bold"
                toggle={e => this.showModal3(e)}
              >
                Cập Nhật Thẻ
              </MDBModalHeader>
              <MDBModalBody>
                <form className="mx-3 grey-text">
                  <MDBInput
                    label="ID:"
                    value={this.state.currId}
                    validate
                    error="wrong"
                    success="right"
                  />
                  <MDBInput
                    label="Nhập tên nhãn"
                    icon="fas fa-hashtag"
                    value={this.state.title}
                    onChange={e => this.handleChange(e)}
                    validate
                    error="wrong"
                    success="right"
                  />
                  <MDBDropdown>
                    <MDBDropdownToggle caret color="primary">
                      Tình Trạng
                    </MDBDropdownToggle>
                    <MDBDropdownMenu basic color="info">
                      <MDBDropdownItem onClick={e => this.setState({ isactive: true })}>
                        kích hoạt
                      </MDBDropdownItem>
                      <MDBDropdownItem
                        onClick={e => this.setState({ isactive: false })}
                      >
                        không kích hoạt
                      </MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </form>
              </MDBModalBody>
              <MDBModalFooter className="justify-content-center">
                <MDBBtn onClick={e => this.handleSubmitUpdate(e)}>
                  Cập Nhật
                </MDBBtn>

                <MDBBtn onClick={e => this.handleCancel(e)}>Thoát</MDBBtn>
              </MDBModalFooter>
            </MDBModal>

            <div>
              <MDBRow className="py-9">
                <MDBCol md="12" className="pl-5 pr-5">
                  <MDBDataTable
                    className="pl-0 pr-0"
                    striped
                    bordered
                    small
                    paging={true}
                    displayEntries={true}
                    data={datamax}
                  />
                </MDBCol>
              </MDBRow>
            </div>
          </MDBCard>
        </MDBContainer>
        <MyAlert
                  open={this.state.open}
                  setOpen={e => this.openAleart(e)}
                  type={this.state.type}
                  content={this.state.content}
                />
      </MainLayout>
    );
  }
}

export default TagManagementPage;
