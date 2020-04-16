import React, { Component, Fragment } from "react";
import { Grid } from "@material-ui/core";
import MainLayout from "../../layouts/main-layout/MainLayout";
import { setAuthHeader } from "../../config/auth";
import Icon from "@mdi/react";
import Tooltip from "@material-ui/core/Tooltip";
import NotFound from "../../components/common/NotFound";
import NotFoundPage from "../../pages/common/NotFoundPage";
import MySpinner from '../../components/common/MySpinner';

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MyRating from "../../components/common/MyRating";
import DoughnutChart from "./forstoryanalystic/charts/echarts/Doughnut";
import ModifiedAreaChart from "./forstoryanalystic/shared/ModifiedAreaChart";
import { mdiAccountMultiple } from "@mdi/js";
import BeautyStars from "beauty-stars";
import StatCards from "./forstoryanalystic/shared/StatCards";
import TableCard from "./forstoryanalystic/shared/TableCard";
// import RowCards from "./forstoryanalystic/shared/RowCards";
import { withStyles } from "@material-ui/styles";
import Statistic from "../../services/statistic.service";
import UserService from "../../services/user.service";
import MyBackdrop from "../../components/common/MyBackdrop";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import StringUtils from "../../utils/string";
//
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";

import { MDBDataTable } from "mdbreact";
import DateTimeUtils from "../../utils/datetime";

class Dashboard1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reactStatic: {
        // times: [],
        commentStatic: [],
        viewStatic: [],
        hitPointStatic: [],
        clickLinkStatic: [],
      },
      openBackdrop: false,
      timeScreenLoad: false,
      clickLoad: false,
      permission: false,
      rating: [],
      ratinguser: 0,
      story: {},
      avgRate: 0,
      anchorEl: null,
      anchorE2: null,
      anchorE3: null,
      daybeforelabel: "Chọn ngày",
      daybeforelabel2: "Chọn ngày",
      daybeforelabel3: "Chọn ngày",
      tagString: "",
      convertedList: [],
      pageInfo: {
        page: 1,
        size: 10,
        totalElement: 10,
        totalPages: 1,
        last: true,
      },
      timelable2: "",
      timelable3: "",
      pageNo: 1,
      datax: {
        columns: [
          // {
          //   label: "#",
          //   field: "id",
          //   sort: "asc",
          //   width: 150,
          // },
          {
            label: "Tiêu đề",
            field: "title",
            sort: "asc",
            width: 270,
          },
          {
            label: "Thời lượng đọc",
            field: "sumtime",
            sort: "asc",
            width: 200,
          },
        ],
        rows: [],
      },

      clickData: {
        columns: [
          {
            label: "Link",
            field: "link",
            sort: "asc",
            width: 270,
          },
          {
            label: "Lượt click",
            field: "count",
            sort: "asc",
            width: 200,
          },
        ],
        rows: [],
      },

      // storyId: this.props.match.params.storyId
    };
    // this.handleLoadReactStatic= this.handleLoadReactStatic.bind(this,6);
  }
  // const [anchorEl, setAnchorEl] = React.useState(null);

  async componentDidMount() {
    setAuthHeader(localStorage.getItem("jwt-token"));

    console.log(
      "compoent did mount , get story summary set state and loading rating"
    );
    if (await this.checkOwner()) {
      const storyInfo = this.getStorySummary(this.sid);
      this.loadRatingStatic();
      this.handleLoadReactStatic(1);
      this.handleLoadScreenTime(1);
      this.handleLoadClickLink(1);
    }
  }
  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };
  handleClick2 = (event) => {
    this.setState({
      anchorE2: event.currentTarget,
    });
  };
  handleClick3 = (event) => {
    this.setState({
      anchorE3: event.currentTarget,
    });
  };

  async checkOwner() {
    this.setState({ openBackdrop: true });
    try {
      let isAllow = await Statistic.checkOwner(this.sid);

      // ko co quyen
      this.setState({ openBackdrop: false });
      if (!isAllow.data) {
        this.props.history.push("/notfound");
      }
      return isAllow.data;
    } catch (error) {
      //co loi
      this.props.history.push("/notfound");
    }
    this.setState({ openBackdrop: false });
    this.props.history.push("/notfound");
    return false;
  }
  async getStorySummary() {
    const res = await Statistic.getStorySummary(this.sid).then((res) => {
      this.setState({ story: res.data });
      console.log("summary");
      console.log(this.state.story);
      let tags = "";
      this.state.story.tags.map((x) => {
        tags = tags + x.title + ",";
      });
      this.setState({ tagString: tags });
    });
  }
  async loadRatingStatic() {
    const res = await Statistic.getRatingStatic(this.sid).then((res) => {
      this.setState({
        rating: res.data.map((rate) => ({
          name: rate.star + " star",
          value: rate.count,
        })),
      });
      let avgrate = 0;
      let totalStar = 0;
      let totalRateTurn = 0;
      for (let i = 0; i < res.data.length; i++) {
        let obj = res.data[i];
        try {
          totalStar = totalStar + parseInt(obj.count) * parseInt(obj.star);
          totalRateTurn = totalRateTurn + parseInt(obj.count);
        } catch (error) {}
      }
      console.log(totalStar / totalRateTurn);
      if (totalRateTurn != 0) {
        this.setState({ avgRate: totalStar / totalRateTurn });
      }

      //cho nao bi rendeẻ lai
      console.log("load rating");
      console.log(this.state.rating);
    });
  }

  sid = this.props.match.params.storyId;

  toddMMyyyy(date) {
    if (Object.prototype.toString.call(date) !== "[object Date]") {
      return this.toddMMyyyy(new Date());
    }
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let y = date.getFullYear();
    if (m < 10) {
      m = "0" + m;
    }

    if (d < 10) {
      d = "0" + d;
    }
    return d + "/" + m + "/" + y;
  }
  toyyyyMMdd(date) {
    if (Object.prototype.toString.call(date) !== "[object Date]") {
      return this.toddMMyyyy(new Date());
    }
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let y = date.getFullYear();
    if (m < 10) {
      m = "0" + m;
    }

    if (d < 10) {
      d = "0" + d;
    }
    return y + "/" + m + "/" + d;
  }
  async getScreenTime(timeRange) {
    this.setState({timeScreenLoad: true})

    setAuthHeader(localStorage.getItem("jwt-token"));
    await Statistic.getScreenTimeData(this.sid, timeRange).then((res) => {
    this.setState({timeScreenLoad: false})

      console.log("screen time");
      console.log(res.data);
      this.convertToScreenTimeList(res.data);
    });
  }

  async getLinkClick(timeRange) {
    this.setState({clickLoad: true})

    setAuthHeader(localStorage.getItem("jwt-token"));
    await Statistic.getLinkClickData(this.sid, timeRange).then((res) => {
    this.setState({clickLoad: false})

      console.log("clickLink");
      console.log(res.data);
      this.convertToClickList(res.data);
    });
  }

  convertToScreenTimeList(data) {
    var userList = data;
    let rowsData = [];

    for (var index = 0; index < userList.length; index++) {
      let rowItem = {};
      rowItem["id"] = StringUtils.truncate(
        StringUtils.removeHtml(userList[index].id),
        8
      );
      rowItem["title"] = userList[index].title;
      rowItem["sumtime"] = userList[index].sumtime;
      rowsData.push(rowItem);
    }

    this.setState({
      datax: {
        columns: [
          // {
          //   label: "ID",
          //   field: "id",
          //   sort: "asc",
          //   width: 50,
          // },
          {
            label: "Tiêu đề",
            field: "title",
            sort: "asc",
            width: 100,
          },
          {
            label: "Thời lượng đọc (giây)",
            field: "sumtime",
            sort: "asc",
            width: 100,
          },
        ],
        rows: rowsData,
      },
    });
    console.log("datx:");
    console.log(this.state.datax);
  }

  convertToClickList(data) {
    var userList = data;
    let rowsData = [];

    for (var index = 0; index < userList.length; index++) {
      let rowItem = {};

      rowItem["link"] = userList[index].link;
      rowItem["count"] = userList[index].count;
      rowsData.push(rowItem);
    }

    this.setState({
      clickData: {
        columns: [
          {
            label: "Link",
            field: "link",
            sort: "asc",
            width: 100,
          },
          {
            label: "Lượt click",
            field: "count",
            sort: "asc",
            width: 100,
          },
        ],
        rows: rowsData,
      },
    });
  }

  async handleLoadReactStatic(daybefore) {
    console.log(daybefore);
    let now = new Date();
    let toDate = new Date();
    toDate.setDate(now.getDate());
    let to = this.toddMMyyyy(toDate);
    console.log("hom nay: ");
    console.log(to);
    let fromDate = new Date();
    let from = "";
    this.setState({ anchorEl: null });
    this.setState({ daybeforelabel: daybefore + " ngày qua" });
    fromDate.setDate(now.getDate() - daybefore);

    from = this.toddMMyyyy(fromDate);

    console.log("da chon ngay");
    console.log(from);
    const timerange = {
      start: from,
      end: to,
    };

    await Statistic.getReactStatic(this.sid, timerange).then((res) => {
      this.setState({
        reactStatic: {
          times: res.data.times,
          commentStatic: res.data.numOfComment,
          hitPointStatic: res.data.numOfHitPoint,
          viewStatic: res.data.numOfView,
          clickLinkStatic: res.data.numOfClickLink,
        },
      });

      // this.setState(...reactStatic);

      //bam vao nut do. thi no vao ham nay, set moi reactStatic thoi
      console.log("du lieu react:");
      console.log(this.state.reactStatic);
    });

    // getReactStatic(23,event.target.value, "26/03/2020");
  }

  handleLoadScreenTime(daybefore) {
   
    this.setState({ anchorE2: null });
    this.setState({ daybeforelabel2: daybefore + " ngày qua" });
    let now = new Date();
    let fromDate = new Date();
    let toDate = new Date();
    toDate.setDate(toDate.getDate() + 1);
    // toDate.setDate(now.getDate()-1);
    let to = this.toyyyyMMdd(toDate);
    let from = "";
    fromDate.setDate(now.getDate() - daybefore);

    from = this.toyyyyMMdd(fromDate);

    let time = now.getHours() + "h" + now.getMinutes() + "p";
    this.setState({
      timelable2:
        "Kết quả từ 0h0p ngày " +
        from +
        " đến " +
        time +
        " ngày hôm nay " +
        this.toyyyyMMdd(now),
    });

    const timerange = {
      start: from,
      end: to,
    };

    this.getScreenTime(timerange);
  }
  handleLoadClickLink(daybefore) {
    this.setState({ anchorE3: null });
    this.setState({ daybeforelabel3: daybefore + " ngày qua" });
    let now = new Date();
    let fromDate = new Date();
    let toDate = new Date();
    toDate.setDate(toDate.getDate() + 1);
    // toDate.setDate(now.getDate()-1);
    let to = this.toyyyyMMdd(toDate);
    let from = "";
    fromDate.setDate(now.getDate() - daybefore);

    from = this.toyyyyMMdd(fromDate);

    let time = now.getHours() + "h" + now.getMinutes() + "p";
    this.setState({
      timelable3:
        "Kết quả từ 0h0p ngày " +
        from +
        " đến " +
        time +
        " ngày hôm nay " +
        this.toyyyyMMdd(now),
    });

    const timerange = {
      start: from,
      end: to,
    };

    this.getLinkClick(timerange);
  }

  render() {
    const theme = {
      palette: {
        primary: {
          /*         					 				*/
          dark: "#721b65",
          main: "#b80d57",
          main2: "#f8615a",
          light: "#ffb300",
          veryl: "#ffd868",
          white: "#f1db9e",
        },
        secondary: {
          main: "#ffb300",
          light: "#ffd54f",
          dark: "#ff6f00",
          main2: "#ff8f00",
          veryl: "#ffecb3",
        },
      },
      root: {
        maxWidth: 345,
      },
      media: {
        height: 340,
        paddingTop: "56.25%",
      },
      buttondate: {
        color: "#FFFFFF",
      },
    };

    return (
      <MainLayout style={{ padding: "0px 0px", opacity: "80%" }}>
        <MyBackdrop
          open={this.state.openBackdrop}
          //  setOpen={() => this.setState({openBackdrop: true})}
        />
        {/* { !this.state.permission ? <NotFoundPage/> : ( */}
        <Fragment>
          <div
            //  className="pb-24 pt-7 px-8 "
            style={{ padding: "24px", backgroundColor: "rgb(51, 51, 51)" }}
          >
            <div
              className="card-title capitalize  mb-4
             "
              style={{ margin: "0 5 0 0", opacity: "80%" }}
            >
              <Typography
                style={{ color: "rgb(221, 107, 102)" }}
                gutterBottom
                variant="h5"
                component="h2"
              >
                {this.state.story.title}
              </Typography>{" "}
              <Button
                variant="outlined"
                style={{ color: "white", outlineColor: "#FFFFF" }}
                aria-owns={this.state.anchorEl ? "simple-menu" : undefined}
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                {this.state.daybeforelabel}
              </Button>
              <div>
                <Menu
                  style={{ borderRadius: "8px" }}
                  id="simple-menu"
                  anchorEl={this.state.anchorEl}
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleLoadReactStatic.bind(this, 1)}
                >
                  <MenuItem onClick={this.handleLoadReactStatic.bind(this, 1)}>
                    1 ngày qua
                  </MenuItem>
                  <MenuItem onClick={this.handleLoadReactStatic.bind(this, 5)}>
                    5 ngày qua
                  </MenuItem>
                  <MenuItem onClick={this.handleLoadReactStatic.bind(this, 28)}>
                    28 ngày qua
                  </MenuItem>
                </Menu>
              </div>
            </div>

            <ModifiedAreaChart
              height="280px"
              option={{
                series: [
                  {
                    data: this.state.reactStatic.viewStatic,
                    // data: [34,12, 31, 45, 31, 43, 26, 43, 31, 45, 33, 40],
                    name: "Lượt xem",
                    type: "line",
                    itemStyle: { color: "#c23531" },
                    smooth: true,
                  },
                  {
                    data: this.state.reactStatic.commentStatic,
                    // data: [34,12, 31, 45, 31, 43, 26, 43, 31, 45, 33, 40],
                    name: "Bình luận",
                    type: "line",
                    itemStyle: { color: "#f4e04d" },
                    smooth: true,
                  },

                  {
                    data: this.state.reactStatic.clickLinkStatic,
                    name: "Click vào link",
                    type: "line",
                    itemStyle: {
                      color: "#759aa0",
                    },
                    smooth: true,
                  },
                  {
                    data: this.state.reactStatic.hitPointStatic,
                    name: "Hoàn thành",
                    type: "line",
                    itemStyle: {
                      color: "#ca8622db",
                    },
                    smooth: true,
                  },
                ],
                xAxis: {
                  data: this.state.reactStatic.times,
                },
              }}
            ></ModifiedAreaChart>
          </div>

          <div className=" m-sm-30 mt--18">
            <Grid container spacing={3}>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                {/* thong tin truyen */}
                <Card style={{ marginBottom: 10, padding: "0px" }}>
                  <CardMedia
                    component="img"
                    alt="Ảnh bìa"
                    height={300}
                    image={this.state.story.image}
                    title="Ảnh bìa"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {this.state.story.title}
                    </Typography>
                    <medium className="border-radius-4 bg-secondary text-white px-2 py-2px ">
                      {this.state.story.numOfScreen} màn
                    </medium>
                    {this.state.story.published ? (
                      <medium className="border-radius-4 bg-primary text-white px-2 py-2px ">
                        Đã xuất bản
                      </medium>
                    ) : (
                      <medium className="border-radius-4 bg-secondary text-white px-2 py-2px ">
                        Chưa xuất bản
                      </medium>
                    )}
                    <Typography
                      noWrap={false}
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {StringUtils.truncate(
                        StringUtils.removeHtml(this.state.story.intro),
                        60
                      )}
                    </Typography>{" "}
                    tạo ngày:
                    <Typography
                      noWrap={false}
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {DateTimeUtils.getDateTime(this.state.story.createdAt)}
                    </Typography>{" "}
                    tag:
                    <Typography
                      noWrap={false}
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {this.state.tagString}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      <a href={"/stories/edit/" + this.state.story.id}>
                        Chỉnh sửa
                      </a>
                    </Button>
                  </CardActions>
                </Card>
                {/* danh gia */}
                <Card className="px-6 py-4 mb-6">
                  <div className="card-title" style={{ paddingLeft: "10px" }}>
                    <h5>
                      Đánh giá {"  "}
                      <Icon
                        path={mdiAccountMultiple}
                        size={1}
                        color="#ccc"
                        style={{ paddingBottom: "2px" }}
                      ></Icon>
                      <strong style={{ color: "#b0b0b0", fontSize: "20px" }}>
                        {this.state.story.numOfRate}
                      </strong>{" "}
                    </h5>{" "}
                  </div>
                  <div className="card-title" style={{ paddingLeft: "10px" }}>
                    {" "}
                    <Tooltip
                      title={"đánh giá trung bình: " + this.state.avgRate}
                      aria-label="add"
                    >
                      <BeautyStars
                        value={this.state.avgRate}
                        gap="3px"
                        size="18px"
                        inactiveColor="#b0b0b0"
                      ></BeautyStars>
                      {/* <MyRating value={this.state.story.avgRate} /> */}
                    </Tooltip>
                  </div>

                  <DoughnutChart
                    height="350px"
                    color={[
                      theme.palette.primary.dark,
                      theme.palette.primary.main,
                      theme.palette.primary.main2,
                      theme.palette.primary.veryl,
                      theme.palette.primary.light,
                    ]}
                    data1={this.state.rating}
                  />
                </Card>

                {/* <UpgradeCard /> */}

                {/* <Campaigns /> */}
              </Grid>
              {/* // thong tin tong quan */}
              <Grid item lg={8} md={8} sm={12} xs={12}>
                <StatCards
                  view={this.state.story.numOfRead}
                  share={this.state.story.numOfShare}
                  hitpoint={this.state.story.numOfHitPoint}
                  clicklink={this.state.story.numOfClickLink}
                />
                {/* <TableCard /> */}
                <h4>Tổng thời gian đọc {"  "} </h4>
                <div>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowDropDownIcon />}
                    aria-owns={this.state.anchorE2 ? "simple-menu" : undefined}
                    aria-haspopup="true"
                    style={{
                      marginBottom: "10px",
                      color: "rgba(0, 0, 0, 0.54)",
                      outlineColor: "#dee2e6",
                      marginRight: "10px",
                    }}
                    onClick={this.handleClick2}
                  >
                    {this.state.daybeforelabel2}
                    {this.state.timeScreenLoad && <MySpinner/>}

                  </Button>
                  <Menu
                    style={{ borderRadius: "8px" }}
                    id="simple-menu"
                    anchorEl={this.state.anchorE2}
                    open={Boolean(this.state.anchorE2)}
                    onClose={this.handleLoadScreenTime.bind(this, 1)}
                  >
                    <MenuItem onClick={this.handleLoadScreenTime.bind(this, 1)}>
                      1 ngày qua
                    </MenuItem>
                    <MenuItem onClick={this.handleLoadScreenTime.bind(this, 5)}>
                      5 ngày qua
                    </MenuItem>
                    <MenuItem
                      onClick={this.handleLoadScreenTime.bind(this, 28)}
                    >
                      28 ngày qua
                    </MenuItem>
                  </Menu>
                  <span
                    style={{
                      color: "rgb(162, 144, 144)",
                      fontSize: "14px",
                    }}
                  >


                    {this.state.timelable2}
                  </span>
                </div>
                <MDBDataTable
                  striped
                  bordered
                  small
                  noRecordsFoundLabel="Chưa có dữ liệu"
                  searching={false}
                  data={this.state.datax}
                  entrieslabel={""}
                  paging={false}
                  displayEntries={false}
                />
                <h4> Lượt click {"  "} </h4>

                <div>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowDropDownIcon />}
                    aria-owns={this.state.anchorE3 ? "simple-menu" : undefined}
                    aria-haspopup="true"
                    style={{
                      marginBottom: "10px",
                      color: "rgba(0, 0, 0, 0.54)",
                      outlineColor: "#dee2e6",
                      marginRight: "10px",
                    }}
                    onClick={this.handleClick3}
                  >

                  {this.state.clickLoad && <MySpinner/>}

                    {this.state.daybeforelabel3}
                  </Button>
                  <Menu
                    style={{ borderRadius: "8px" }}
                    id="simple-menu"
                    anchorEl={this.state.anchorE3}
                    open={Boolean(this.state.anchorE3)}
                    onClose={this.handleLoadClickLink.bind(this, 1)}
                  >
                    <MenuItem onClick={this.handleLoadClickLink.bind(this, 1)}>
                      1 ngày qua
                    </MenuItem>
                    <MenuItem onClick={this.handleLoadClickLink.bind(this, 5)}>
                      5 ngày qua
                    </MenuItem>
                    <MenuItem onClick={this.handleLoadClickLink.bind(this, 28)}>
                      28 ngày qua
                    </MenuItem>
                  </Menu>

                  <span
                    style={{
                      color: "rgb(162, 144, 144)",
                      fontSize: "14px",
                    }}
                  >
                    {this.state.timelable3}
                  </span>
                </div>
                <MDBDataTable
                  striped
                  bordered
                  small
                  noRecordsFoundLabel="Chưa có dữ liệu"
                  searching={false}
                  data={this.state.clickData}
                  entrieslabel={""}
                  paging={false}
                  displayEntries={false}
                />

                {/* <Pagination
                        // count={pageInfo.totalPages}
                        count={3}
                        color="primary"
                        boundaryCount={2}
                        // onChange={changePage}
                      /> */}
              </Grid>
            </Grid>
          </div>
        </Fragment>
        
      </MainLayout>
    );
  }
}

export default withStyles({}, { withTheme: true })(Dashboard1);
