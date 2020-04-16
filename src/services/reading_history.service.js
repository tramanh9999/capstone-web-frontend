import axios from 'axios';
import { setAuthHeader, getTokenFromLocal } from '../config/auth';
import ValidationUtils from '../utils/validation';
import { API_URL } from '../config/api';

const base_url = API_URL + '/api/story-service/reading_history';

class ReadingHistoryService {

    static async saveReadingHistory({ listScreenId, storyId, isReachingEnd }) {
        const token = getTokenFromLocal();
        let url = base_url;
        if (ValidationUtils.isEmpty(token)) {
            url = base_url + '/public'
        } else {
            setAuthHeader(token);
        }

        return axios.post(url, { listScreenId, storyId, reachingEnd: isReachingEnd });
    }

    static async saveCLickLink(data) {
        const url = base_url + '/public/clicklink';
        return axios.post(url, data);
    }

    static async saveScreenReadTime({ screenId, duration }) {
        const url = base_url + '/public/screen_read_time';
        return axios.post(url, { screenId, duration });
    }

    static async getReadingHistory(userId, pageNo) {
        setAuthHeader(getTokenFromLocal());
        const url = base_url.concat('/getReadingHistory?pageSize=5&pageNo=').concat(pageNo).concat('&userId=').concat(userId);
        return axios.get(url);
    }

}


export default ReadingHistoryService;