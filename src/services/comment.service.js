import axios from 'axios';
import { setAuthHeader, getTokenFromLocal } from '../config/auth';
import { API_URL } from '../config/api';

const base_url = API_URL + '/api/comment-service/api/v1/comment';

class CommentService {
    static async addComment(comment) {
        setAuthHeader(getTokenFromLocal());
        const url = base_url;
        return axios.post(url, comment);
    }

    static async getComments(pageNo, sortBy, storyId) {
        const url = base_url.concat('/public/getAll?pageSize=10&pageNo=').concat(pageNo).concat('&sortBy=').concat(sortBy).concat('&storyId=').concat(storyId);
        return axios.get(url);

    }

    static async getCommentHistory(userId, pageNo) {
        setAuthHeader(getTokenFromLocal());
        const url = base_url.concat('/getCommentHistory?pageSize=5&pageNo=').concat(pageNo).concat('&userId=').concat(userId);
        return axios.get(url);

    }

    static async deleteComment(deleteCommentRequest) {
        setAuthHeader(getTokenFromLocal());
        const url = base_url.concat('/delete');
        return axios.post(url, deleteCommentRequest);
    }

    static async updateComment(updateCommentRequest) {
        setAuthHeader(getTokenFromLocal());
        const url = base_url.concat('/update');
        return axios.put(url, updateCommentRequest);
    }
}

export default CommentService;