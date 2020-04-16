import React from 'react';
import moment from 'moment';

const CommentLis = (props) => {
    const { comments, toggleModal } = props;
    return (
        <div>
             {comments.map((comment, index) => (
                <div className="row mb-3" key={comment.id}>
                    <div className="col-1 px-0">
                        <img className="img-fluid"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSIXnjwudDywy5WuyASjNbpjnoRmyLKFYyvcfuJJEtqRCcUBJeb" />
                    </div>
                    <div className="col-11">
                        <small>
                            <strong className="mr-3">{comment.username}</strong>
                            <span>{moment(comment.createdAt).format('HH:mm DD/MM/YYYY')}</span>
                        </small>
                        <p>{comment.content}
                        </p>

                        {/* <span className="mr-3" >
                            <i class="far fa-thumbs-up" id="like-icon" style={{ color: 'blue' }}></i> <span className="likes-count">{comment.likes.length}</span>
                        </span> */}
                        <span className="mr-3" >
                            <i class={comment.likes.includes(userId) ? "fas fa-thumbs-up" : "far fa-thumbs-up"}
                                onClick={e => like(comment.likes.includes(userId), comment.id)}
                                style={{ cursor: 'pointer' }}>
                            </i>
                            <span className="likes-count"> {comment.likes.length}</span>
                        </span>
                        <span className="mr-3">
                            <i class={comment.dislikes.includes(userId) ? "fas fa-thumbs-down" : "far fa-thumbs-down"}
                                onClick={e => dislike(comment.dislikes.includes(userId), comment.id)}
                                style={{ cursor: 'pointer' }}>
                            </i>
                            <span className="dislikes-count"> {comment.dislikes.length}</span>
                        </span>
                        {userId !== comment.userId &&
                            <button type="button" class="btn btn-danger" onClick={toggleModal('reportModal', comment.id, index, comment.username, comment.content)}>
                                <i class="far fa-flag" ></i>
                            </button>
                        }
                        {userId === comment.userId &&
                            <button type="button" class="btn btn-warning" onClick={toggleModal('editModal', comment.id, index)}>
                                <i class="far fa-edit" ></i>
                            </button>

                        }
                        {userId === comment.userId &&
                            <button type="button" class="btn btn-warning" onClick={toggleModal('deleteModal', comment.id, index)}>
                                <i class="far fa-trash-alt" ></i>
                            </button>
                        }



                    </div>
                    <hr />
                </div>
            ))}
        </div>
    );
};


export default CommentLis;
