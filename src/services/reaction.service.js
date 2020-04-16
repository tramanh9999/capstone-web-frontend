import axios from 'axios';
import { setAuthHeader, getTokenFromLocal } from '../config/auth';
import { API_URL } from '../config/api';

const base_url = API_URL + '/api/comment-service/api/v1/reaction';

class ReactionService {

    static async getReactionHistory(userId, pageNo) {
        setAuthHeader(getTokenFromLocal());
        const url = base_url.concat('/getReactionHistory?pageSize=5&pageNo=').concat(pageNo).concat('&userId=').concat(userId);
        return axios.get(url);
    }

    static async deleteReaction(deleteReactionRequest) {
        setAuthHeader(getTokenFromLocal());
        const url = base_url.concat('/delete');
        return axios.post(url, deleteReactionRequest);
    }

    static async react(reactRequest) {
        setAuthHeader(getTokenFromLocal());
        const url = base_url.concat('/react');
        return axios.post(url, reactRequest);
    }
}


export default ReactionService;