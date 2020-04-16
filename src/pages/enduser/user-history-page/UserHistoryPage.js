import React, { useState, useCallback, useEffect } from 'react';
import MainLayout from '../../../layouts/main-layout/MainLayout';
import {
    MDBNavItem, MDBNavLink, MDBTabContent, MDBTabPane, MDBNav, MDBModal,
    MDBModalHeader, MDBModalBody, MDBModalFooter, MDBBtn, MDBInput,
} from 'mdbreact';
import { Link } from 'react-router-dom';
import CommentService from '../../../services/comment.service';
import ReactionService from '../../../services/reaction.service';
import ReadingHistoryService from '../../../services/reading_history.service';
import moment from 'moment';
import { getAuthUserInfo } from '../../../config/auth';
import StringUtils from '../../../utils/string';
import MySpinner from '../../../components/common/MySpinner';

import MyAlert from '../../../components/common/MyAlert';


const UserHistoryPage = () => {
    const userInfo = getAuthUserInfo();

    const [activeItem, setActiveItem] = useState('1');

    const [modalState, setModalState] = useState({
        deleteModal: false,
        editModal: false,
        deleteReactionModal: false
    });
    const [commentIndex, setCommentIndex] = useState(-1);
    const [reactionIndex, setReactionIndex] = useState(-1);
    const [deleteRequest, setDeleteRequest] = useState({
        userId: 1,
        commentId: 0,
    });
    const [alert, setAlert] = useState({ content: '', type: 'success', open: false });
    const closeAlert = () => window.setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        getCommentHistory();
    }, []);
    useEffect(() => {
        getReactionHistory();
    }, []);
    useEffect(() => {
        getReadingHistory();
    }, []);

    const [histories, setHistories] = useState([]);
    const [historyPageNo, setHistoryPageNo] = useState(1);
    const [isLastHistoryPage, setIsLastHistoryPage] = useState(true);
    const getReadingHistory = async () => {
        if (userInfo !== null) {
            setHistoryLoading(true);
            try {
                var array = [...histories];
                if (array.length > 1) {
                    setHistoryPageNo(historyPageNo + 1);
                    const res = await ReadingHistoryService.getReadingHistory(userInfo.id, commentPageNo + 1);

                    res.data.content.forEach(element => {
                        setHistories(histories => [...histories, element]);
                    });
                    setIsLastHistoryPage(res.data.last);
                }
                else {
                    setHistoryPageNo(1);
                    const res = await ReadingHistoryService.getReadingHistory(userInfo.id, 1);
                    setHistories(res.data.content);
                    setIsLastHistoryPage(res.data.last);
                }
            } catch (error) {
            }
            setHistoryLoading(false);
        }
    }
    const deleteComment = async () => {
        if (userInfo !== null) {
            try {
                var deleteComment = { ...deleteRequest };
                deleteComment.userId = userInfo.id;
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
                    content: 'Có lỗi xảy ra',
                    type: 'error',
                    open: true
                });
            }
        }
        closeAlert();

    }
    const deleteReaction = async () => {
        if (userInfo !== null) {
            try {
                var deleteReact = { ...deleteRequest };
                deleteReact.userId = userInfo.id;
                const res = await ReactionService.deleteReaction(deleteReact);
                setModalState({ ...modalState, deleteReactionModal: false });
                if (reactionIndex !== -1) {
                    var array = [...reactions];
                    setReactions(array.filter(item => item.commentId !== deleteRequest.commentId));
                }
                setAlert({
                    content: 'Xóa reaction thành công',
                    type: 'success',
                    open: true
                });
            } catch (error) {
                setAlert({
                    content: 'Có lỗi xảy ra',
                    type: 'error',
                    open: true
                });
            }
        }
        closeAlert();
    }
    const [modalError, setModalError] = useState('');
    const updateComment = async () => {
        if (userInfo !== null) {
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
                setAlert({
                    content: error.response.data.message,
                    type: 'error',
                    open: true
                });
            }
        }
        closeAlert();
    }


    const [updateCommentRequest, setUpdateCommentRequest] = useState({
        content: '',
        userId: 0,
        commentId: 0
    });
    const [comments, setComments] = useState([]);
    const [reactions, setReactions] = useState([]);

    const [commentPageNo, setCommentPageNo] = useState(1);

    const toggle = tab => e => {
        if (activeItem !== tab) {
            setActiveItem(tab);
        }
    };


    //TODO
    //const [isShowMore, setShowMore] = useState(false);
    const [isLastCommentPage, setIsLastCommentPage] = useState(true);
    const getCommentHistory = async () => {
        if (userInfo !== null) {
            try {
                var array = [...comments];
                if (array.length > 1) {
                    setCommentPageNo(commentPageNo + 1);
                    const res = await CommentService.getCommentHistory(userInfo.id, commentPageNo + 1);

                    res.data.content.forEach(element => {
                        setComments(comments => [...comments, element]);
                    });
                    setIsLastCommentPage(res.data.last);
                }
                else {
                    setCommentPageNo(1);
                    const res = await CommentService.getCommentHistory(userInfo.id, 1);
                    setComments(res.data.content);
                    setIsLastCommentPage(res.data.last);
                }
            } catch (error) {
            }
        }

    }
    const [reactionPageNo, setReactionPageNo] = useState(1);
    const [isLastReactionPage, setIsLastReactionPage] = useState(true);
    const getReactionHistory = async () => {
        if (userInfo !== null) {
            try {
                var array = [...reactions];
                if (array.length > 1) {
                    setReactionPageNo(reactionPageNo + 1);
                    const res = await ReactionService.getReactionHistory(userInfo.id, reactionPageNo + 1);

                    res.data.content.forEach(element => {
                        setReactions(reactions => [...reactions, element]);
                    });
                    setIsLastReactionPage(res.data.last);
                }
                else {
                    setReactionPageNo(1);
                    const res = await ReactionService.getReactionHistory(userInfo.id, 1);
                    setReactions(res.data.content);
                    setIsLastReactionPage(res.data.last);
                }

            } catch (error) {
            }
        }

    }
    const toggleModal = (modal, commentIdSpec, index) => e => {

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
                setModalError('');
            }
            else {
                setModalState({ ...modalState, editModal: true });
                setUpdateCommentRequest({ ...updateCommentRequest, commentId: commentIdSpec, content: comments[index].content });
            }
        }
        if (modal === 'deleteReactionModal') {
            setReactionIndex({ reactionIndex: index });
            if (modalState.deleteReactionModal === true) {
                setModalState({ ...modalState, deleteReactionModal: false });
            }
            else {
                setModalState({ ...modalState, deleteReactionModal: true });
            }
            setDeleteRequest({ ...deleteRequest, commentId: commentIdSpec });
        }




    }

    return (
        <MainLayout>
            <div className="container-fluid">
                <MDBNav className="nav-tabs mb-3">
                    <MDBNavItem>
                        <MDBNavLink link to="#" active={activeItem === "1"} onClick={toggle("1")} role="tab" >
                            Đọc truyện
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink link to="#" active={activeItem === "2"} onClick={toggle("2")} role="tab" >
                            Bình luận
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink link to="#" active={activeItem === "3"} onClick={toggle("3")} role="tab" >
                            Reaction
                        </MDBNavLink>
                    </MDBNavItem>
                </MDBNav>
                <MDBTabContent activeItem={activeItem} >
                    <MDBTabPane tabId="1" role="tabpanel">
                        <div className="row">
                            {histories.map((history, index) => (
                                <div className="col-8">
                                    <div className="card mb-3">
                                        <div className="row no-gutters">
                                            <div className="col-md-4">
                                                <img src={history.storyImageUrl === null ? '/assets/img/no_image.jpeg' : history.storyImageUrl} className="card-img" />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body">
                                                    <h5 className="card-title">{history.storyName}</h5>
                                                    <p className="card-text" >{StringUtils.truncate(StringUtils.removeHtml(history.storyContent), 60)}</p>
                                                    <small>{moment(history.createdAt).format('HH:mm DD/MM/YYYY')}</small>
                                                    <div>
                                                        <Link target="_blank"
                                                            to={`/stories/details/${history.storyId}`}>
                                                            <button className="btn btn-warning float-right">Đọc truyện</button></Link>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                        {historyLoading && <MySpinner />}

                        {(histories.length < 1 && !historyLoading) &&
                            <div className="text-center">
                                <small>Không có lịch sử đọc truyện.</small>
                            </div>
                        }
                        <br>

                        </br>

                        {!isLastHistoryPage > 0 &&
                            <div className="text-center">
                                <button className="btn btn-secondary" onClick={getReadingHistory}>Xem thêm</button>
                            </div>
                        }
                    </MDBTabPane>
                    <MDBTabPane tabId="2" role="tabpanel">

                        {comments.map((comment, index) => (
                            <div className="clearfix" key={comment.id}>
                                Bạn đã <strong>bình luận</strong> vào truyện <Link target="_blank"
                                    to={`/stories/details/${comment.storyId}`}>
                                    <strong>{comment.storyName}</strong>:</Link>

                                <p> "{comment.content}"
                            </p>
                                <div>
                                    <small>{moment(comment.createdAt).format('HH:mm DD/MM/YYYY')}</small>
                                </div>
                                <button className="btn btn-danger float-right" onClick={toggleModal('deleteModal', comment.id, index)}>Xóa</button>
                                <button className="btn btn-warning float-right" onClick={toggleModal('editModal', comment.id, index)}>Chỉnh sửa</button>

                            </div>
                        ))}
                        {comments.length < 1 &&
                            <div className="text-center">
                                <small>Không có lịch sử bình luận.</small>
                            </div>
                        }
                        <br>

                        </br>

                        {!isLastCommentPage > 0 &&
                            <div className="text-center">
                                <button className="btn btn-secondary" onClick={getCommentHistory}>Xem thêm</button>
                            </div>
                        }




                    </MDBTabPane>

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
                    <MDBTabPane tabId="3" role="tabpanel">

                        {reactions.map((reaction, index) => (
                            <div className="clearfix" key={reaction.id}>
                                Bạn đã <strong>{reaction.type}</strong> bình luận của <Link target="_blank" to={`/user/profile/${reaction.commentOwnerId}`}><strong>{reaction.commentOwnerName}</strong></Link> trong truyện <Link target="_blank"
                                    to={`/stories/details/${reaction.storyId}`}>
                                    <strong>{reaction.storyName}</strong>:</Link>
                                <div>
                                    <small>{moment(reaction.createdAt).format('HH:mm DD/MM/YYYY')}</small>
                                </div>
                                <button className="btn btn-danger float-right" onClick={toggleModal('deleteReactionModal', reaction.commentId, index)}>Xóa</button>

                            </div>
                        ))}
                        {reactions.length < 1 &&
                            <div className="text-center">
                                <small>Không có lịch sử react.</small>
                            </div>
                        }
                        <br>
                        </br>


                        {!isLastReactionPage > 0 &&
                            <div className="text-center">
                                <button className="btn btn-secondary" onClick={getReactionHistory}>Xem thêm</button>
                            </div>
                        }


                        <MDBModal isOpen={modalState.deleteReactionModal} toggle={toggleModal('deleteReactionModal')}>
                            <MDBModalHeader toggle={toggleModal('deleteReactionModal')}>Xóa bình luận</MDBModalHeader>
                            <MDBModalBody>
                                Bạn có muốn xóa reaction này không?
                    </MDBModalBody>
                            <MDBModalFooter>
                                <MDBBtn color='success' onClick={toggleModal('deleteReactionModal')}>
                                    Không
                    </MDBBtn>
                                <MDBBtn color='danger' onClick={deleteReaction}>Có</MDBBtn>
                            </MDBModalFooter>
                        </MDBModal>
                        {/* {[1, 2, 3, 4].map(item => (
                        <div className="clearfix">
                            Ban da <strong>danh gia</strong> vao truyen <strong>Nghin le mot dem</strong> cua tac gia <strong>Nguyen Van A</strong> voi <strong>4 sao</strong>
                            <div>
                                <small>10:20 20/10/2019</small>
                            </div>
                        </div>
                    ))} */}
                    </MDBTabPane>

                </MDBTabContent>

            </div>
            <MyAlert
                open={alert.open}
                setOpen={(open) => setAlert({ ...alert, open: open })}
                type={alert.type}
                content={alert.content}
            />
        </MainLayout>
    );
};


export default UserHistoryPage;
