import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../../layouts/main-layout/MainLayout';
import { TableContainer, Table, TableHead, TableBody, Divider,
  TableCell, TableRow, Paper, FormControl, TextField, InputAdornment, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Search as SearchIcon, Book as BookIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Pagination } from '@material-ui/lab';
import StoryService from '../../services/story.service';
import { getOrderBys } from '../../common/constants';
import MyDropdownMenu from '../../components/common/MyDropdownMenu';
import MySpinner from '../../components/common/MySpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import TagList from '../../components/common/TagList';
import MyAlert from '../../components/common/MyAlert';
import ValidationUtils from '../../utils/validation';
import DateTimeUtils from '../../utils/datetime';
import { Link } from 'react-router-dom';

let searchTimeout = null;
let currentStory = null;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const orderBys = getOrderBys()

const StoryManagementPage =  (props) => {
  const classes = useStyles();
  

  const [stories, setStories] = useState([]);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  // const [story, setStory] = useState(null);
  
  const [openAlert, setOpenAlert] = useState(false);
  const [alert, setAlert] = useState({ content: '', type: 'success' });
  const [filters, setFilters] = useState({
      keyword: '',
      orderBy: 'avg_rate',
      asc: false,
      page: 1,
      itemsPerPage: 10,
  });

  useEffect(() => {
    searchStories();
  }, []);


  const changeFilters = (prop, value) => {
      filters[prop] = value;
      setFilters({ ...filters });
      if(prop === 'keyword'){
          clearTimeout(searchTimeout);
          searchTimeout = window.setTimeout(() => {
              setFilters({ ...filters, page: 1 });
              searchStories();
          }, 300);
      } else {
          searchStories();
      }
  }

  const changePage = (e, value) => {
  console.log(value);
  changeFilters('page', value);
  }

  const getStories = async () => {
      let data = [];
      setIsLoadingStories(true);
      try {
          const res = await StoryService.getStoriesForAdmin({ ...filters });
          console.log(res);
          
          data = res.data.content;
          setTotalPages(res.data.totalPages);
      } catch (error) {
          console.log(error);
      }
      setIsLoadingStories(false);
      return data;
  }

  const searchStories = async () => {
      const stories = await getStories();
      setStories(stories);
  }

  const viewStory = (story) => {
    window.open('/stories/details/' + story.id);
  }

  const updateStory = async () => {
    // console.log(currentStory);
    const enable = currentStory.deactiveByAdmin ? true : false;
    try {
      const res = await StoryService.updateStoryByAdmin(currentStory.id, enable);
      console.log(res);
      if(res.data.success){
        const s = stories.find(st => st.id === currentStory.id);
        s.deactiveByAdmin = enable ? false : true;
        setStories([...stories]);
        setAlert({ content: 'Cập nhật thành công', type: 'success' });
      } else {
        setAlert({ content: Object.values(res.data.errors)[0], type: 'error' });
      }
    } catch (error) {
      console.log(error);
    }
    currentStory = null;
    setOpenAlert(true);
    setOpenDialog(false);
  }

  const handleUpdateByAdmin = (story) => {
    console.log(story);
    currentStory = story;
    const enable = currentStory.deactiveByAdmin ? true : false;
    if(enable){
      setDialogContent('Bạn có chắc chắn muốn khôi phục truyện này chứ?')
    } else {
      setDialogContent('Bạn có chắc chắn muốn khóa truyện này chứ?')
    }
    setOpenDialog(true);
  }

  const cancel = () => {
    setOpenDialog(false);
    currentStory = null;
  }

  return (
    <MainLayout>
      <h3 className="text-center">Quản lý truyện</h3>
      <div className="container">
      
        <div className="row mt-5">
          <div className="col-12">
          <h3 className="">Tất cả truyện</h3>
          <hr style={{ border: '1px solid #ccc' }} />
          <div className="row">
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
          {/* {isLoadingStories && <MySpinner/>} */}
          
          <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="caption table">
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
                    <TableCell align="center">Tác giả</TableCell>
                    <TableCell align="center">Nhãn</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { stories.map((story, index) => (
                    <TableRow key={story.id}>
                      <TableCell align="center">{(filters.page - 1) * filters.itemsPerPage + index + 1}</TableCell>
                      <TableCell align="center">{ story.title }</TableCell>
                      <TableCell align="center">
                        <img style={{ width: '80px' }}  src={story.image}/>
                      </TableCell>
                      <TableCell align="center">
                        {DateTimeUtils.getDate(story.createdAt)}
                      </TableCell>
                      <TableCell align="center">{story.numOfScreen}</TableCell>
                      <TableCell align="center">{story.numOfRead}</TableCell>
                      <TableCell align="center">{story.numOfComment}</TableCell>
                      <TableCell align="center">{story.numOfRate}</TableCell>
                      <TableCell align="center">{story.avgRate}</TableCell>
                      <TableCell align="center">{story.deactiveByAdmin ? <span className="text-danger">ĐÃ BỊ KHÓA</span> : <span className="text-success">CHƯA KHÓA</span>}</TableCell>
                      <TableCell align="center">
                        {ValidationUtils.isEmpty(story.user) ? '' : <a href={`/user/profile/${story.user.id}`} target="_blank">{story.user.name}</a>}
                      </TableCell>
                      <TableCell align="center">
                        <div style={{ maxWidth: '150px' }}>
                          <small>
                            <TagList tags={story.tags} />
                          </small>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <MyDropdownMenu>
                          <MenuItem onClick={() => viewStory(story)}>
                             Xem truyện
                          </MenuItem>
                          {/* <MenuItem>Chi tiết</MenuItem> */}
                          <Divider/>
                          <MenuItem onClick={() => handleUpdateByAdmin(story)}>
                            {story.deactiveByAdmin ? 'Khôi phục truyện' : 'Khóa truyện'}
                          </MenuItem>
                        </MyDropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

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
            <ConfirmDialog
              openDialog={openDialog}
              cancel={cancel}
              ok={updateStory}
              setOpenDialog={setOpenDialog}
              content={dialogContent}
          />

          <MyAlert 
              open={openAlert}
              setOpen={setOpenAlert}
              type={alert.type}
              content={alert.content}
          />
            
          </div>
        </div>
      </div>
     
    </MainLayout>
  )
}

export default StoryManagementPage;