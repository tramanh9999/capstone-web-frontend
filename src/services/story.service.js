import axios from "axios";
import { getAuthUserInfo } from "../config/auth";
import { API_URL } from '../config/api';

const baseUrl = API_URL + "/api/story-service/stories";

const baseUrl2 = API_URL + "/api/story-service";

class StoryService {
  static async createStory(story) {
    const url = baseUrl;
    return axios.post(url, story);
  }
  
  static async getRatingByStoryAndUser(storyId) {
    const url = baseUrl + '/rate/' + storyId;
    return axios.get(url);
  }

  static async updateStory(story) {
    const url = baseUrl;
    return axios.put(url, story);
  }

  static async rateStory(storyId, stars) {
    const url = baseUrl + "/rate?storyId=" + storyId + "&stars=" + stars;
    return axios.put(url);
  }

  static async getReadingStory(storyId) {
    const url = baseUrl + "/public/read/" + storyId;
    return axios.get(url);
  }

  static async getStoriesByAuthor(
    userId,
    { orderBy, asc, keyword, page, itemsPerPage }
  ) {
    const url =
      baseUrl +
      "/get_by_author" +
      `?orderBy=${orderBy}&asc=${asc}&keyword=${keyword}&page=${page}&itemsPerPage=${itemsPerPage}`;
    return axios.get(url);
  }

  static async searchStories({
    tags,
    keyword,
    isActive,
    isPublished,
    page,
    itemsPerPage
  }) {
    const url =
      baseUrl +
      `/public/search?keyword=${keyword}&isActive=${isActive}&isPublished=${isPublished}&page=${page}&itemsPerPage=${itemsPerPage}&tags=${tags}`;
    return axios.get(url);
  }

  static async searchStoriesByUserProfile({
    tags,
    keyword,
    userId,
    page,
    itemsPerPage
  }) {
    const url =
      baseUrl +
      `/public/search_by_user_profile?keyword=${keyword}&userId=${userId}&page=${page}&itemsPerPage=${itemsPerPage}&tags=${tags}`;
    return axios.get(url);
  }

  static async getTrendStories() {
    const url = baseUrl + "/public/trend";
    return axios.get(url);
  }

  
  static async updateStoryImage({ storyId, image }) {
    const url = baseUrl + `/upload_story_image?storyId=${storyId}&image=${image}`;
    return axios.put(url);
  }

  static async getStoryDetails(storyId) {
    const url = baseUrl + "/public/" + storyId;
    return axios.get(url);
  }

  static async getSuggestion(pageNo) {
    let pagesize = 4;
    try {
      const userinfo = getAuthUserInfo();

      if (userinfo === null) {
        const url1 =
          baseUrl2 +
          "/suggestion/suggeststory"
            .concat("?pageNo=")
            .concat(pageNo)
            .concat("&pageSize=")
            .concat(pagesize);
        return axios.get(url1);
      } else {
        const url =
          baseUrl2 +
          "/suggestion/suggest"
            .concat(userinfo.id)
            .concat("?pageNo=")
            .concat(pageNo)
            .concat("&pageSize=")
            .concat(pagesize);
        return axios.get(url);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }

  static async updateStoryByAdmin(storyId, enable) {
    const url = baseUrl + "/update_by_admin/" + storyId + "/" + enable;
    return axios.put(url);
  }

  static async deleteStory(storyId) {
    const url = baseUrl + "/" + storyId;
    return axios.delete(url);
  }

  static async changePublishedStatus(storyId, turnOnPublished) {
    const url =
      baseUrl +
      "/change_published?storyId=" +
      storyId +
      "&turnOnPublished=" +
      turnOnPublished;
    return axios.put(url);
  }

  static getStoriesForAdmin({ page, itemsPerPage, asc, orderBy, keyword }) {
    const url =
      baseUrl +
      `/get_for_admin?page=${page}&itemsPerPage=${itemsPerPage}&asc=${asc}&orderBy=${orderBy}&keyword=${keyword}`;
    return axios.get(url);
  }
}

export default StoryService;
