import axios from "axios";
import { API_URL } from "../config/api";

const baseUrl = API_URL + "/api/story-service/statistics";

class StatisticService {
  static async getReadStatisticsOfUser(from, to) {
    const url = baseUrl + `/get_read_statistics_of_user?from=${from}&to=${to}`;
    return axios.get(url);
  }

  static async getScreenTimeData(sid, timeRange) {
    let screenUrl = baseUrl + "/story/" + sid + "/screen-time";

    return axios.post(screenUrl, timeRange);
  }
  static async getLinkClickData(sid, timeRange) {
    let screenUrl = baseUrl + "/story/" + sid + "/link-click";
    return axios.post(screenUrl, timeRange);
  }

  static async getStorySummary(storyId) {
    const url = baseUrl + `/story/` + storyId + `/summary`;
    return axios.get(url);
  }

  static async getReactStatic(storyId, timeRange) {
    const url = baseUrl + `/story/` + storyId + `/react`;
    return axios.post(url, timeRange);
  }
  static async getRatingStatic(storyId) {
    const url = baseUrl + `/story/` + storyId + `/rating`;
    return axios.get(url);
  }

  static async checkOwner(storyId){
    const url = baseUrl + `/story/` + storyId + `/check`;
    return axios.get(url);
  }
}

export default StatisticService;
