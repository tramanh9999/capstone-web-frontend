import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import {
    MDBModal, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle,
    MDBModalHeader, MDBModalBody, MDBModalFooter, MDBBtn, MDBInput, MDBRating
} from 'mdbreact';
import CommentService from '../../../services/comment.service';
import ReactionService from '../../../services/reaction.service';
import ReportService from '../../../services/report.service';
import moment from 'moment';

import MainLayout from '../../../layouts/main-layout/MainLayout';
import StoryService from '../../../services/story.service';
import ValidationUtils from '../../../utils/validation';

import NotFound from '../../../components/common/NotFound';
    import MySpinner from '../../../components/common/MySpinner';
import TagList from '../../../components/common/TagList';
import StringUtils from '../../../utils/string';

import { getAuthUserInfo } from '../../../config/auth';
import MyRating from '../../../components/common/MyRating';
import MyAlert from '../../../components/common/MyAlert';
import SocialShare from '../../../components/common/SocialShare';

const StoryDetailsPage = (props) => {

    const userInfo = getAuthUserInfo();

    const [story, setStory] = useState({});
    const [storyNotfound, setStoryNotfound] = useState(false);
    const [isLoadingStory, setIsLoadingStory] = useState(false);
    const [alert, setAlert] = useState({ open: false, type: 'success', content: '' })
    const [rating, setRating] = useState({})


    const [modalState, setModalState] = useState({
        deleteModal: false,
        editModal: false,
        reportModal: false,
        isLoggedInModal: false,
        reportStoryModal: false
    });

    const [commentIndex, setCommentIndex] = useState(-1);

    const [deleteRequest, setDeleteRequest] = useState({
        userId: 0,
        commentId: 0,
    });

    const [updateCommentRequest, setUpdateCommentRequest] = useState({
        content: '',
        userId: 0,
        commentId: 0
    });

    const [modalError, setModalError] = useState('');

    const [comments, setComments] = useState([]);
    const [sortBy, setSortBy] = useState('reaction');
    const [isOpenModal, setOpen] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [reportCommentRequest, setReportCommentRequest] = useState({
        userId: 0,
        commentId: 0,
        content: ''
    });
    
    const [reportCommentModalInfo, setReportCommentModalInfo] = useState({
        userName: '',
        comment: '',
    });

    const [reportStoryModalInfo, setReportStoryModalInfo] = useState({
        userName: '',
        storyName: '',
    });

    const [pageNo, setPageNo] = useState(1);
    const [userId, setUserId] = useState(0);
    const [reactRequest, setReactReqeust] = useState({
        userId: 0,
        commentId: 0,
        type: ''
    });
    //const [alert, setAlert] = useState({ content: '', type: 'success', open: false });
    //const closeAlert = () => window.setTimeout(() => setAlert({ ...alert, open: false }), 3000);

    const [isLastPage, setIsLastPage] = useState(true);

    useEffect(() => {
        getComments();
        if (userInfo !== null) {
            setUserId(userInfo.id);
        }
    }, []);

    useEffect(() => {
        const { storyId } = props.match.params;
        getStoryDetails(storyId);
    }, []);


    const updateComment = async () => {
        try {
            var updateComment = { ...updateCommentRequest };
            updateComment.userId = userInfo.id;
            const res = await CommentService.updateComment(updateComment);
            setModalState({ ...modalState, editModal: false });
            var array = [...comments];
            setComments(array.map(item => item.id === updateCommentRequest.commentId ? { ...item, content: updateCommentRequest.content } : item));
            setAlert({
                content: 'Chỉnh sửa bình luận thành công',
                type: 'success',
                open: true
            });
        } catch (error) {
            //setModalError(error.response.data.message);
            setAlert({
                content: error.response.data.message,
                type: 'error',
                open: true
            });
        }
        closeAlert();
    }

    const toggleModal = (modal, commentIdSpec, index, username, content) => e => {

        if (modal === 'deleteModal') {
            setCommentIndex({ commentIndex: index });
            if (modalState.deleteModal === true) {
                setModalState({ ...modalState, deleteModal: false });
            }
            else {
                setModalState({ ...modalState, deleteModal: true });
            }
            setDeleteRequest({ ...deleteRequest, commentId: commentIdSpec });
        }
        if (modal === 'editModal') {
            setCommentIndex({ commentIndex: index });
            if (modalState.editModal === true) {
                setModalState({ ...modalState, editModal: false });
                //setModalError('');
            }
            else {
                setModalState({ ...modalState, editModal: true });
                setUpdateCommentRequest({ ...updateCommentRequest, commentId: commentIdSpec, content: comments[index].content });
            }
        }
        if (modal === 'reportModal') {
            if (userInfo === null) {
                setAlert({
                    content: 'Vui lòng đăng nhập để sử dụng tính năng này',
                    type: 'error',
                    open: true
                });
            }
            else {
                setReportCommentModalInfo({ userName: username, comment: content });
                if (modalState.reportModal === true) {
                    setModalState({ ...modalState, reportModal: false });
                    //setModalError('');
                }
                else {
                    setModalState({ ...modalState, reportModal: true });
                }
                setReportCommentRequest({ ...reportCommentRequest, commentId: commentIdSpec });
            }


        }
        if (modal === 'reportStoryModal') {
            if (userInfo === null) {
                setAlert({
                    content: 'Vui lòng đăng nhập để sử dụng tính năng này',
                    type: 'error',
                    open: true
                });
            }
            else {
                //setReportStoryModalInfo({ userName: "update later", storyName: story.title });
                if (modalState.reportStoryModal === true) {
                    setModalState({ ...modalState, reportStoryModal: false });
                    //setModalError('');
                }
                else {
                    setModalState({ ...modalState, reportStoryModal: true });
                }
            }
        }
    }

    const deleteComment = async () => {
        try {
            var deleteComment = { ...deleteRequest };
            deleteComment.userId = userInfo.id;
            //setDeleteRequest({ ...deleteRequest, userId: userId });
            const res = await CommentService.deleteComment(deleteComment);
            setModalState({ ...modalState, deleteModal: false });
            if (commentIndex !== -1) {
                var array = [...comments];
                setComments(array.filter(item => item.id !== deleteRequest.commentId));
            }
            setAlert({
                content: 'Xóa bình luận thành công',
                type: 'success',
                open: true
            });
        } catch (error) {
            setAlert({
                content: 'Xóa bình luận thất bại',
                type: 'error',
                open: true
            });
        }
        closeAlert();
    }

    const sendComment = async () => {
        if (userId === 0) {
            setAlert({
                content: 'Vui lòng đăng nhập để sử dụng tính năng này',
                type: 'error',
                open: true
            });
        }
        else {
            try {
                //setSendCommentRequest({ ...sendCommentRequest, userId: userId });
                var sendCommentRequest = {
                    storyId: props.match.params.storyId,
                    userId: userInfo.id,
                    content: commentContent
                }
                const res = await CommentService.addComment(sendCommentRequest);
                var array = [...comments];
                array.unshift(res.data);
                setCommentContent('');
                setComments(array);
                setAlert({
                    content: 'Gửi bình luận thành công',
                    type: 'success',
                    open: true
                });
            } catch (error) {
                setAlert({
                    content: error.response.data.message,
                    type: 'error',
                    open: true
                });
            }
        }
        closeAlert();
    }

    const getCommentsBySort = async (sortString) => {
        setSortBy(sortString);
        setPageNo(1);
        const { storyId } = props.match.params;
        const res = await CommentService.getComments(1, sortString, storyId);

        setComments(res.data.content);
        setIsLastPage(res.data.last);
    }

    const getComments = async () => {
        try {
            var array = [...comments];
            if (array.length > 1) {
                setPageNo(pageNo + 1);
                const pageNumber = pageNo + 1;
                const { storyId } = props.match.params;
                const res = await CommentService.getComments(pageNumber, sortBy, storyId);
                res.data.content.forEach(element => {
                    setComments(comments => [...comments, element]);
                });
                setIsLastPage(res.data.last);
            }
            else {
                const { storyId } = props.match.params;
                const res = await CommentService.getComments(pageNo, sortBy, storyId);
                setComments(res.data.content);
                setIsLastPage(res.data.last);
            }

        } catch (error) {
            //console.log(error.response.request._response);
        }
    }

    const reportComment = async () => {
        try {
            var reportComment = { ...reportCommentRequest };
            reportComment.userId = userInfo.id;
            const res = await ReportService.reportComment(reportComment);
            setReportCommentRequest({ ...reportCommentRequest, content: '' });
            setModalState({ ...modalState, reportModal: false });
            setAlert({
                content: 'Đã gửi báo cáo',
                type: 'success',
                open: true
            });
            //setModalError('');
        } catch (error) {
            //setModalError(error.response.data.message);
            setAlert({
                content: error.response.data.message,
                type: 'error',
                open: true
            });
        }
        closeAlert();
    }

    const like = async (type, commentId) => {
        if (userInfo === null) {
            setAlert({
                content: 'Vui lòng đăng nhập để sử dụng tính năng này',
                type: 'error',
                open: true
            });
        }
        else {
            try {
                const request = { ...reactRequest };
                request.userId = userInfo.id;
                request.commentId = commentId;
                request.type = "like";

                const res = await ReactionService.react(request);

                var array = [...comments];

                if (type) {
                    setComments(array.map(item => item.id === commentId ?
                        { ...item, likes: item.likes.filter(like => like !== userId) }
                        : item));
                }
                else {
                    setComments(array.map(item => item.id === commentId ?
                        { ...item, ...item.likes.push(userId) }
                        : item));
                    setComments(array.map(item => item.id === commentId ?
                        { ...item, dislikes: item.dislikes.filter(like => like !== userId) }
                        : item));
                }
            } catch (error) {

            }
        }
        closeAlert();
    }

    const dislike = async (type, commentId) => {
        if (userInfo === null) {
            setAlert({
                content: 'Vui lòng đăng nhập để sử dụng tính năng này',
                type: 'error',
                open: true
            });
        }
        else {
            try {
                const request = { ...reactRequest };
                request.userId = userInfo.id;
                request.commentId = commentId;
                request.type = "dislike";

                const res = await ReactionService.react(request);

                var array = [...comments];
                if (type) {
                    setComments(array.map(item => item.id === commentId ?
                        { ...item, dislikes: item.dislikes.filter(like => like !== userId) }
                        : item));
                }
                else {
                    setComments(array.map(item => item.id === commentId ?
                        { ...item, ...item.dislikes.push(userId) }
                        : item));
                    setComments(array.map(item => item.id === commentId ?
                        { ...item, likes: item.likes.filter(like => like !== userId) }
                        : item));
                }
            } catch (error) {

            }
        }
        closeAlert();
    }

    const getStoryDetails = async (storyId) => {
        setIsLoadingStory(true);
        try {
            const res = await StoryService.getStoryDetails(storyId);
            console.log(res);
            if (ValidationUtils.isEmpty(res.data)) {
                setStoryNotfound(true);
            } else {
                setStory(res.data);
                if(!ValidationUtils.isEmpty(userInfo)){
                    getRatingByStoryAndUser(res.data.id);
                }
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoadingStory(false);
    }

    const [reportStoryContent, setReportStoryContent] = useState('');
   
    const reportStory = async () => {
        try {
            const { storyId } = props.match.params;
            var request = {
                userId: userInfo.id,
                storyId: storyId,
                content: reportStoryContent
            }
            const res = await ReportService.reportStory(request);
            setModalState({ ...modalState, reportStoryModal: false });
            //setModalError('');
            setAlert({
                content: 'Đã gửi báo cáo truyện',
                type: 'success',
                open: true
            });
        } catch (error) {
            //setModalError(error.response.data.message)
            setAlert({
                content: error.response.data.message,
                type: 'error',
                open: true
            });
        }
        closeAlert();
    }

    const getRatingByStoryAndUser = async (storyId) => {
        try {
            const res = await StoryService.getRatingByStoryAndUser(storyId);
            console.log(res);
            setRating({ ...res.data });
        } catch (error) {
            console.log(error);
        }
    }

    const rateStory = async (stars) => {
        if(ValidationUtils.isEmpty(userInfo)) return;
        if(ValidationUtils.isEmpty(stars)) return;
        try {
            const res = await StoryService.rateStory(story.id, stars);
            const { success, errors, data } = res.data;
            if (success) {
                setRating({ ...rating, stars: stars })
                setAlert({
                    open: true,
                    type: 'success',
                    content: `Bạn vừa đánh giá ${story.title} ${data.stars} sao`
                })
            } else {
                setAlert({
                    open: true,
                    type: 'error',
                    content: Object.values(errors)[0]
                })
            }
        } catch (error) {
            console.log(error);
        }
        closeAlert();
    }

    const closeAlert = () => window.setTimeout(() => setAlert({ ...alert, open: false }), 3000);

    const reacted = {
        color: 'blue'
    };

    return (

        <MainLayout>
            <div className="container-fluid">
                {isLoadingStory && (<MySpinner />)}

                {(!storyNotfound && !isLoadingStory && !ValidationUtils.isEmpty(story)) && (
                    <>
                        <div className="row">
                            <div className="col-sm-3">
                                <img
                                    className="img-fluid"
                                    src={ValidationUtils.isEmpty(story.image) ? '/assets/img/no_image.jpeg' : story.image} />
                                <div className="text-center">
                                    <Link
                                        className="btn btn-success btn-block mt-2"
                                        to={`/stories/read/${story.id}`}>Đọc truyện</Link>
                                    {/* <Link className="btn btn-warning" to={`/stories/edit/${story.id}`}>Sua truyen</Link> */}
                                </div>
                                {userId !== story.user.id &&
                                    <div className="text-center btn btn-danger btn-block mt-1" onClick={toggleModal('reportStoryModal')}>
                                        Báo cáo
                                    </div>
                                }

                                <div>
                                    <SocialShare shareUrl={`${window.location.href}`} />
                                </div>
                            </div>
                            <div className="col-sm-9">
                                <h3 className="font-weight-bold">{story.title}</h3>
                                {!ValidationUtils.isEmpty(story.user) && (
                                    <h4>
                                        <Link to={`/user/profile/${story.user.id}`}>
                                            {/* <PersonIcon />   */}
                                            <img src={story.user.avatar} style={{ width: '30px', height: '30px' }}/>
                                             {' ' + story.user.name}
                                        </Link>
                                    </h4>
                                )}
                                <strong style={{ fontSize: '1.2em', color: 'orange' }}>Điểm trung bình: {story.avgRate}</strong>
                                <div>
                                    <strong>Lượt đánh giá: </strong>{story.numOfRate}
                                </div>
                                <div>
                                    <strong>Lượt đọc: </strong>{story.numOfRead}
                                </div>
                                <div className="my-3">
                                    <strong>Giới thiệu</strong>
                                    <p>{StringUtils.parseHtml(story.intro)}</p>
                                </div>
                                <strong>Tags:</strong> <TagList tags={story.tags} />
                                <div className="my-3">
                                    <strong>Đánh giá truyện:</strong>
                                    <br />
                                    {ValidationUtils.isEmpty(rating) && (
                                        <small>Hãy để lại đánh giá để chúng tôi biết thêm về sở thích đọc truyện của bạn nhé</small>
                                    )}
                                    <MyRating
                                        onChange={(value) => rateStory(value)}
                                        value={ValidationUtils.isEmpty(rating) ? 0 : rating.stars} />
                                </div>
                                <form onSubmit={e => { e.preventDefault(); sendComment(); }}>
                                    <div className="form-group">
                                        <textarea
                                            className="form-control"
                                            rows="1"
                                            placeholder="Bình luận..."
                                            value={commentContent}
                                            onChange={e => setCommentContent(e.target.value)}></textarea>
                                    </div>
                                    <button className="btn btn-success float-right" type="submit">Gửi</button>
                                </form>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-3">
                                <h4 className="text-bold">Thông tin truyện</h4>
                                <hr />
                                {!ValidationUtils.isEmpty(story.user) && (
                                    <div>
                                        <strong>Tác giả: </strong><Link to={`/user/profile/${story.user.id}`}>{story.user.name}</Link>
                                    </div>
                                )}
                                <div>
                                    <strong>Ngày tạo: </strong>{new Date(story.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="col-sm-9">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <h4 className="text-bold">
                                            Bình luận
                                </h4>
                                    </div>
                                    <div className="col-sm-8">
                                        <MDBDropdown className="float-right">
                                            <MDBDropdownToggle caret color="ins">
                                                Sắp xếp
                                         </MDBDropdownToggle>
                                            <MDBDropdownMenu basic >
                                                <MDBDropdownItem onClick={e => getCommentsBySort('reaction')}>Nổi bật</MDBDropdownItem>
                                                <MDBDropdownItem onClick={e => getCommentsBySort('createdAt')}>Mới nhất</MDBDropdownItem>
                                            </MDBDropdownMenu>
                                        </MDBDropdown>
                                    </div>
                                </div>
                                {/* danh sach binh luan */}
                                {comments.map((comment, index) => (
                                    <div className="row mb-3" key={comment.id}>
                                        <div className="col-1 px-0">
                                            <img className="img-fluid"
                                                src={comment.userAvatarUrl} />
                                        </div>
                                        <div className="col-11">
                                            <small>
                                                <strong className="mr-3">{comment.username}</strong>
                                                <span>{moment(comment.createdAt).format('HH:mm DD/MM/YYYY')}</span>
                                            </small>
                                            <p>{comment.content}
                                            </p>

                                            {/* <span className="mr-3" >
                                        <i className="far fa-thumbs-up" id="like-icon" style={{ color: 'blue' }}></i> <span className="likes-count">{comment.likes.length}</span>
                                    </span> */}
                                            <span className="mr-3" >
                                                <i className={comment.likes.includes(userId) ? "fas fa-thumbs-up" : "far fa-thumbs-up"}
                                                    onClick={e => like(comment.likes.includes(userId), comment.id)}
                                                    style={{ cursor: 'pointer' }}>
                                                </i>
                                                <span className="likes-count"> {comment.likes.length}</span>
                                            </span>
                                            <span className="mr-3">
                                                <i className={comment.dislikes.includes(userId) ? "fas fa-thumbs-down" : "far fa-thumbs-down"}
                                                    onClick={e => dislike(comment.dislikes.includes(userId), comment.id)}
                                                    style={{ cursor: 'pointer' }}>
                                                </i>
                                                <span className="dislikes-count"> {comment.dislikes.length}</span>
                                            </span>
                                            {userId !== comment.userId &&
                                                <button type="button" className="btn btn-danger" onClick={toggleModal('reportModal', comment.id, index, comment.username, comment.content)}>
                                                    <i className="far fa-flag" ></i>
                                                </button>
                                            }
                                            {userId === comment.userId &&
                                                <button type="button" className="btn btn-warning" onClick={toggleModal('editModal', comment.id, index)}>
                                                    <i className="far fa-edit" ></i>
                                                </button>

                                            }
                                            {userId === comment.userId &&
                                                <button type="button" className="btn btn-warning" onClick={toggleModal('deleteModal', comment.id, index)}>
                                                    <i className="far fa-trash-alt" ></i>
                                                </button>
                                            }

                                        </div>
                                        <hr />
                                    </div>
                                ))}
                                {comments.length < 1 &&
                                    <div className="text-center mt-4">
                                        <small>Truyện chưa có bình luận, hãy để lại một bình luận nhé.</small>
                                    </div>
                                }
                                <MDBModal isOpen={modalState.editModal} toggle={toggleModal('editModal')}>
                                    <MDBModalHeader toggle={toggleModal('editModal')}>Chỉnh sửa bình luận</MDBModalHeader>
                                    <MDBModalBody>
                                        {modalError.length > 0 && <small style={{ color: 'red' }}>(*){modalError}</small>}
                                        <form className='mx-3 grey-text'>
                                            <MDBInput
                                                type='textarea'
                                                rows='2'
                                                label='Nội dung bình luận'
                                                value={updateCommentRequest.content}
                                                onChange={e => setUpdateCommentRequest({ ...updateCommentRequest, content: e.target.value })}
                                            />
                                        </form>
                                    </MDBModalBody>
                                    <MDBModalFooter>
                                        <MDBBtn color='success' onClick={toggleModal('editModal')}>
                                            Hủy
                                        </MDBBtn>
                                        <MDBBtn color='warning' onClick={updateComment}>Chỉnh sửa</MDBBtn>
                                    </MDBModalFooter>
                                </MDBModal>
                                <MDBModal isOpen={modalState.deleteModal} toggle={toggleModal('deleteModal')}>
                                    <MDBModalHeader toggle={toggleModal('deleteModal')}>Xóa bình luận</MDBModalHeader>
                                    <MDBModalBody>
                                        Bạn có muốn xóa bình luận này không?
                        </MDBModalBody>
                                    <MDBModalFooter>
                                        <MDBBtn color='success' onClick={toggleModal('deleteModal')}>
                                            Không
                        </MDBBtn>
                                        <MDBBtn color='danger' onClick={deleteComment}>Có</MDBBtn>
                                    </MDBModalFooter>
                                </MDBModal>
                                <MDBModal isOpen={modalState.reportModal} toggle={toggleModal('reportModal')}>
                                    <MDBModalHeader toggle={toggleModal('reportModal')}>Báo cáo bình luận</MDBModalHeader>
                                    <MDBModalBody>
                                        <p>Người dùng: <strong>{reportCommentModalInfo.userName}</strong></p>
                                        <p>Nội dung bình luận: <strong>"{reportCommentModalInfo.comment}"</strong></p>
                                        {modalError.length > 0 && <small style={{ color: 'red' }}>(*){modalError}</small>}
                                        <form className='mx-3 grey-text'>
                                            <MDBInput
                                                type='textarea'
                                                rows='2'
                                                label='Nội dung báo cáo'
                                                onChange={e => setReportCommentRequest({ ...reportCommentRequest, content: e.target.value })}
                                            />
                                        </form>
                                    </MDBModalBody>
                                    <MDBModalFooter>
                                        <MDBBtn color='success' onClick={toggleModal('reportModal')}>
                                            Hủy
                                        </MDBBtn>
                                        <MDBBtn color='danger' onClick={reportComment}>Gửi</MDBBtn>
                                    </MDBModalFooter>
                                </MDBModal>

                                <MDBModal isOpen={modalState.reportStoryModal} toggle={toggleModal('reportStoryModal')}>
                                    <MDBModalHeader toggle={toggleModal('reportStoryModal')}>Báo cáo truyện</MDBModalHeader>
                                    <MDBModalBody>
                                        <p>Truyện: <strong>{story.title}</strong></p>
                                        <p>Tác giả: <strong>{story.user.name}</strong></p>
                                        {modalError.length > 0 && <small style={{ color: 'red' }}>(*){modalError}</small>}
                                        <form className='mx-3 grey-text'>
                                            <MDBInput
                                                type='textarea'
                                                rows='2'
                                                label='Nội dung báo cáo'
                                                onChange={e => setReportStoryContent(e.target.value)}
                                            />
                                        </form>
                                    </MDBModalBody>
                                    <MDBModalFooter>
                                        <MDBBtn color='success' onClick={toggleModal('reportStoryModal')}>
                                            Hủy
                                        </MDBBtn>
                                        <MDBBtn color='danger' onClick={reportStory}>Gửi</MDBBtn>
                                    </MDBModalFooter>
                                </MDBModal>


                                {!isLastPage &&
                                    <div className="text-center">
                                        <button className="btn btn-secondary" onClick={getComments}>Xem thêm</button>
                                    </div>
                                }
                                {/* <div className="text-center">
                             <button className="btn btn-success">Xem them</button>
                         </div> */}

                            </div>
                        </div>
                    </>

                )}
                {storyNotfound && <NotFound message="Không tìm thấy câu truyện này" />}
                <MyAlert
                    open={alert.open}
                    setOpen={(open) => setAlert({ ...alert, open: open })}
                    type={alert.type}
                    content={alert.content}
                />
            </div>
            <MyAlert
                content={alert.content}
                type={alert.type}
                open={alert.open}
                setOpen={() => setAlert({ ...alert, open: true })}
            />
        </MainLayout>

    );
};


export default StoryDetailsPage;
