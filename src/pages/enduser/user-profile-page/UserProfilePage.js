import React, { useState, useEffect } from "react";
import MainLayout from "../../../layouts/main-layout/MainLayout";
import {
  MDBAlert,
  MDBBtn,
} from "mdbreact";

import UserService from "../../../services/user.service";
import { UserContext } from "../../../context/user.context";
import { getAuthUserInfo, setAuthHeader, getTokenFromLocal } from "../../../config/auth";
import { getOrderBys } from '../../../common/constants';

import DateTimeUtils from "../../../utils/datetime";
import StoryService from "../../../services/story.service";
import { FormControl, TextField, InputLabel, Select, MenuItem, TableContainer, 
  Table, TableHead, TableRow, TableCell, TableBody, Divider, InputAdornment, Paper, IconButton, Tooltip } from "@material-ui/core";
import { Search as SearchIcon, DataUsage as DataUsageIcon } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import TagList from '../../../components/common/TagList';
import StringUtils from "../../../utils/string";
import ValidationUtils from "../../../utils/validation";
import MyDropdownMenu from '../../../components/common/MyDropdownMenu';
import MySpinner from '../../../components/common/MySpinner';
import NotFound from '../../../components/common/NotFound';
import MyAlert from '../../../components/common/MyAlert';
import MyBackdrop from '../../../components/common/MyBackdrop';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import MyDatePicker from '../../../components/common/MyDatePicker';
import UserProfileHeader from './UserProfileHeader';
import Typography from '@material-ui/core/Typography';
import UserReadingChart from "./UserReadingChart";
import StatisticService from '../../../services/statistic.service';


const orderBys = getOrderBys();

let searchTimeout;

const getDateAgo = (numOfDays) => {
  const d = new Date();
  return new Date(d.setDate(d.getDate() - numOfDays));
}

const UserProfilePage = (props) => {

  const [user, setUser] = useState({});
  const [isloadingUser, setLoadingUser] = useState(false);
  const [userNotfound, setUserNotfound] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [userNotfoundMessage, setUserNotfoundMessage] = useState('');
  const [stories, setStories] = useState([]);
  const [story, setStory] = useState(null);
  const [isLoadingstories, setIsLoadingStories] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [dateRange, setDateRange] = useState({ from: getDateAgo(7), to: new Date() });
  const [readingStatisticData, setReadingStatisticData] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
    orderBy: 'avg_rate',
    asc: false,
    page: 1,
    itemsPerPage: 10,
  });

  const [alert, setAlert] = useState({ content: '', type: 'success', open: false });
  const [dialog, setDialog] = useState({ content: '', open: false });

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    await getUserInfo();
    if(!userNotfound){
      getStoriesByAuthor();
      getReadStatistic();
    }
  }

  const getReadStatistic = async (dateRange) => {
    if(ValidationUtils.isEmpty(dateRange)) dateRange = { from: getDateAgo(7), to: new Date() };
    let { from, to } = dateRange;
    
    from = from.toLocaleDateString();
    to = to.toLocaleDateString();
    console.log(from);
    console.log(to);
    try {
      const res = await StatisticService.getReadStatisticsOfUser(from, to);
      const { data, success, errors } = res.data;
      
      if(success){
        console.log(data);
        setReadingStatisticData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getStoriesByAuthor = async () => {
    setAuthHeader(getTokenFromLocal());
    setIsLoadingStories(true);
    try {
      const res = await StoryService.getStoriesByAuthor(user.id, filters);
      console.log(res);
      const { content, totalPages } = res.data;
      setStories(content);
      setTotalPages(totalPages)
    } catch (error) {
      console.log(error);
    }
    setIsLoadingStories(false);
  };

  const getUserInfo = async () => {
    setLoadingUser(true);
    setOpenBackdrop(true);
    try {
        const token = getTokenFromLocal();
        const res = await UserService.getCurrentUser(token);
        console.log(res);
        const { data, success, errors } = res.data;
        if(success){
          setUser(data);
        } else {
          setUserNotfound(true);
          setUserNotfoundMessage(Object.values(errors)[0]);
        }
    } catch (error) {
      setUserNotfound(true);
      console.log(error);   
    }
    setLoadingUser(false);
    setOpenBackdrop(false);
  }

  const changeFilters = (prop, value) => {
    filters[prop] = value;
    setFilters({ ...filters });
    if(prop === 'keyword'){
        clearTimeout(searchTimeout);
        searchTimeout = window.setTimeout(() => {
            setFilters({ ...filters, page: 1 });
            getStoriesByAuthor();
        }, 300);
    } else {
      getStoriesByAuthor();
    }
  }

  const changePage = (e, value) => {
    changeFilters('page', value);
  }

  const editStory = (story) => props.history.push('/stories/edit/' + story.id);

  const readStory = (story) => window.open('/stories/read/' + story.id, '_blank');

  const deleteStory = async () => {
    setDialog({ ...dialog, open: false })
    try {
      const res = await StoryService.deleteStory(story.id);
      console.log(res);
      const { success, errors } = res.data;
      if(success){
        setAlert({ type: 'success', content: 'Xóa thành công', open: true });
        getStoriesByAuthor();
      } else {
        setAlert({ type: 'error', content: Object.values(errors)[0], open: true });
      }
      
      closeAlert();
    } catch (error) {
      console.log(error);
    }
  }

  const closeAlert = () => window.setTimeout(() => setAlert({ ...alert, open: false }), 3000);

  const handleDeleteStory = (story) => {
    setStory(story);
    setDialog({ open: true, content: 'Bạn có chắc chắn muốn xóa ' + story.title + '?' });
  }

  const changePublishedStatus = async (story) => {
    
    setAuthHeader(getTokenFromLocal());
    const turnOnPublished = !story.published;
    try {
      const res = await StoryService.changePublishedStatus(story.id, turnOnPublished);
      const { success, errors } = res.data;
      console.log(res);
      if(success){
        setAlert({ 
          type: 'success', 
          content: 'Đổi trạng thái xuất bản thành công',
          open: true
       });
        const index = stories.findIndex(s => s.id === story.id);
        stories[index].published = !story.published;
        setStories([...stories]);
      } else {
        setAlert({ 
          type: 'error', 
          content: Object.values(errors)[0],
          open: true
        });
      }
    } catch (error) {
      console.log(error);
    }
    closeAlert();
  }

  const cancel = () => {
    setStory(null);
    setDialog({ ...dialog, open: false });
  }

  const changeDateRange = (prop, value) => {
    setDateRange({ ...dateRange, [prop]: value });
    getReadStatistic({ ...dateRange, [prop]: value });
  }

  return (
    <MainLayout>
      <div className="container-fluid" style={{ paddingBottom: '100px' }}>
        {(!isloadingUser && !userNotfound && !ValidationUtils.isEmpty(user)) && (
          <>
              <div className="row mb-5">
                <div className="col-12">
                  <UserProfileHeader user={user} canEdit={true} />
                </div> 
              </div>

                <h3 className="text-bold">Thống kê lượt đọc tất cả các truyện</h3> 
                <hr style={{ border: "1px solid #ccc" }} /> 
                <div className="row my-5">
                  <div className="col-12">
                    <MyDatePicker
                      date={dateRange.from}
                      setDate={(value) =>  changeDateRange('from', value)}
                      label="Tù ngày"
                    />
                    <span className="mr-4"></span>
                     <MyDatePicker
                      date={dateRange.to}
                      setDate={(value) => changeDateRange('to', value)}
                      label="Đến ngày"
                    />
                    <UserReadingChart
                      data={readingStatisticData.map(item => ({ ...item, name: 'Lượt đọc' }))}
                      dataKeyName="dateCreated"
                      dataKeyArea="readCount"
                    />
                  </div>
                </div>

                <h3 className="text-bold"> Truyện của bạn </h3> 
                <hr style={{ border: "1px solid #ccc" }} /> 
                                    
                <div className="row my-5">
                    <div className="col-sm-3">
                      <FormControl>
                        <TextField
                          // variant="outlined"
                          style={{ width: '100%' }}
                          label="Tìm truyện..."
                          value={filters.keyword} 
                          onChange={(e) => changeFilters('keyword', e.target.value)} 
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                      </FormControl>
                    </div>
                    <div className="col-sm-3">
                      <FormControl style={{ width: '100%' }}>
                          <InputLabel>Sắp xếp theo</InputLabel>
                          <Select
                              value={filters.orderBy}
                              onChange={(e) => changeFilters('orderBy', e.target.value)}
                          >
                              {orderBys.map((orderBy) => (
                                  <MenuItem key={orderBy.value} value={orderBy.value}>
                                      {orderBy.title}
                                  </MenuItem>
                              ))}
                          </Select>
                      </FormControl>
                    </div>
                    <div className="col-sm-3">
                      <FormControl >
                          <InputLabel>Thứ tự</InputLabel>
                          <Select
                              value={filters.asc}
                              onChange={(e) => changeFilters('asc', e.target.value)}
                          >
                                <MenuItem value={true}>
                                    Tăng dần
                                </MenuItem>
                                <MenuItem value={false}>
                                    Giảm dần
                                </MenuItem>
                          </Select>
                      </FormControl>
                    </div>
                  </div>
                {/* {isLoadingstories && <MySpinner/>} */}

              {stories.length > 0 && (
                  <>
                  <div className="row my-3">
                    <div className="col-12">
                      <Pagination 
                          style={{float: 'right'}}
                          count={totalPages} 
                          page={filters.page}
                          color="primary"
                          onChange={changePage} />
                    </div>
                  </div>

                  <div className="row mb-5">
                    <div className="col-12">
                    <TableContainer component={Paper} >
                        <Table>
                          <caption>Tất cả truyện</caption>
                          <TableHead>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell align="center">Tiêu đề</TableCell>
                              <TableCell align="center">Ảnh</TableCell>
                              <TableCell align="center">Ngày tạo</TableCell>
                              <TableCell align="center">Số màn hình</TableCell>
                              <TableCell align="center">Lượt đọc</TableCell>
                              <TableCell align="center">Lượt bình luận</TableCell>
                              <TableCell align="center">Lượt đánh giá</TableCell>
                              <TableCell align="center">Đánh giá trung bình</TableCell>
                              <TableCell align="center">Trạng thái</TableCell>
                              <TableCell align="center">Nhãn</TableCell>
                              <TableCell align="center"></TableCell>
                              <TableCell align="center"></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            { stories.map((story, index) => (
                              <TableRow key={story.id}>
                                <TableCell align="center">{ index + 1}</TableCell>
                                <TableCell align="center">{ story.title }</TableCell>
                                <TableCell align="center">
                                  <img style={{ width: '80px' }}  src={story.image}/>
                                </TableCell>
                                <TableCell align="center">{DateTimeUtils.getDateTime(story.createdAt)}</TableCell>
                                <TableCell align="center">{story.numOfScreen}</TableCell>
                                <TableCell align="center">{story.numOfRead}</TableCell>
                                <TableCell align="center">{story.numOfComment}</TableCell>
                                <TableCell align="center">{story.numOfRate}</TableCell>
                                <TableCell align="center">{story.avgRate}</TableCell>
                                <TableCell align="center">{story.published ? <span className="text-success">Đã xuất bản</span> : <span className="text-danger">Chưa xuát bản</span>}</TableCell>
                                <TableCell align="center">
                                  <div style={{ maxWidth: '150px' }}>
                                    <small>
                                      <TagList tags={story.tags} />
                                    </small>
                                  </div>
                                </TableCell>
                                <TableCell>
                                      <Tooltip title="Xem thống kê" style={{ display: 'inline-block' }}>
                                        <IconButton
                                          style={{ display: 'inline-block' }}
                                          color="inherit"
                                          onClick={() => { props.history.push('/story/analystics/' + story.id) }}
                                        >
                                          <DataUsageIcon />
                                        </IconButton>
                                      </Tooltip>
                                </TableCell>
                               
                                <TableCell align="center">
                                   
                                  <MyDropdownMenu>
                                    <MenuItem onClick={() => readStory(story)}>
                                      Đọc truyên
                                    </MenuItem>
                                    <MenuItem onClick={() => editStory(story)}>
                                      Cập nhật
                                    </MenuItem>
                                    <MenuItem onClick={() => changePublishedStatus(story)}>
                                      {story.published ? 'Hủy xuất bản truyện' : 'Xuất bản truyện'}
                                    </MenuItem>
                                    <Divider/>
                                    <MenuItem onClick={() => handleDeleteStory(story)}>
                                      Xóa truyện
                                    </MenuItem>
                                  </MyDropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                </div>
                              
                  <div className="row my-3">
                    <div className="col-12">
                      <Pagination 
                          style={{float: 'right'}}
                          count={totalPages} 
                          page={filters.page}
                          color="primary"
                          onChange={changePage} />
                    </div>
                  </div>
                </>
              )}
              

              {(!isLoadingstories && stories.length == 0) && <NotFound message="Không tìm thấy truyện nào..." />}
              
          </>
        )}

        {!userNotfound && <NotFound message={ userNotfoundMessage } />}
      </div> 

      <ConfirmDialog
          openDialog={dialog.open}
          cancel={cancel}
          ok={deleteStory}
          setOpenDialog={() => setDialog({ ...dialog, open: true })}
          content={dialog.content}
      />

      <MyBackdrop open={openBackdrop} setOpen={setOpenBackdrop}/>

      <MyAlert 
          open={alert.open}
          setOpen={() => setAlert({ ...alert, open: true })}
          type={alert.type}
          content={alert.content}
      />
    </MainLayout>
  );
};

export default UserProfilePage;
