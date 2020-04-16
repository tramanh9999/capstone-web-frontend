import axios from 'axios';
import { API_URL } from '../config/api';

const baseUrl = API_URL + '/story-service/tags';

class TagService {
    static async getTags(){
        const url = baseUrl + '/public/all';
        return axios.get(url);
    }
    static async getAllTag(){
        const url = baseUrl + "/public/getAll";
    return axios.get(url);
    }

    static async addTag(tag){
        const url = baseUrl;
    return axios.post(url, tag);
    }

    static async updateTag(tag){
        const config = {
            headers: {
              "Content-Type": "application/json"
            }
          };
          const url = baseUrl;
        return  axios.put(url, tag, config);
    }
}

export default TagService;