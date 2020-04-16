import axios from "axios";
import {
  clearTokenFromLocal,
  getAuthUserInfo,
  setAuthHeader,
} from "../config/auth";
import { ROLE_NAMES } from "../common/constants";
import { API_URL } from "../config/api";

const baseUrl = API_URL + "/api/user-service/api/v1";

class UserService {
  static async getCurrentUser(token) {
    setAuthHeader(token);
    const url = baseUrl + "/user/current";
    return axios.get(url);
  }

  static async getUserPublicProfile(userId) {
    const url = baseUrl + "/user/public_profile/" + userId;
    return axios.get(url);
  }

  static async login(user) {
    const url = baseUrl + "/auth/signin";
    return axios.post(url, user);
  }

  static async register(user) {
    const url = baseUrl + "/auth/signup";
    return axios.post(url, user);
  }
  static async addUser(user) {
    const url = baseUrl + "/admin/users/add";
    return axios.post(url, user);
  }

  static async getUsersList(page, size, search) {
    const url =
      baseUrl +
      "/admin/users/userOnly?page=" +
      page +
      "&size=" +
      size +
      "&s=" +
      search;
    return axios.get(url);
  }

  static async getAdminsList(page, size, search) {
    const url =
      baseUrl +
      "/systemad/admins?page=" +
      page +
      "&size=" +
      size +
      "&s=" +
      search;
    return axios.get(url);
  }

  static async setStatusUser(userId, status) {
    let url = baseUrl + "/admin/users/" + userId + "?setActive=" + status;
    return axios.delete(url);
  }

  static async setStatusAdmin(userId, status) {
    let url = baseUrl + "/systemad/admins/" + userId + "?setActive=" + status;
    return axios.delete(url);
  }

  static async logout() {
    let user = getAuthUserInfo();
    clearTokenFromLocal();
    setAuthHeader(null);
    if (
      user.role === ROLE_NAMES.ROLE_SYSTEM_ADMIN ||
      user.role === ROLE_NAMES.ROLE_ADMIN
    ) {
      window.location.href = "/login";
    } else {
      window.location.href = "/home";
    }
    user = null;
  }

  static async addAdmin(user) {
    const url = baseUrl + "/systemad";
    return axios.post(url, user);
  }

  static async getMyProfile() {
    let url = baseUrl + "/user/me";
    return axios.get(url);
  }
  static async getProById(userId) {
    let url = baseUrl + "/user/" + userId;
    return axios.get(url);
  }

  static async randomAvatar() {}

  static async uploadImage (file){
    let urlx = "https://api.imgur.com/3/image";
    const clientid = "ff80852491ab3a1";
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Client-ID " + clientid,
      },
    };
    var formdata = new FormData();
    formdata.append("image", file);

    return axios.post(urlx, formdata, config);
  }

  // static async uploadAvatar(file) {
  //   let urlx = "https://api.imgur.com/3/image";
  //   const clientid = "ff80852491ab3a1";
  //   const config = {
  //     headers: {
  //       "content-type": "multipart/form-data",
  //       Authorization: "Client-ID " + clientid,
  //     },
  //   };
  //   var formdata = new FormData();
  //   formdata.append("image", file);

  //   return axios.post(urlx, formdata, config);
  // }

  // static async uploadProfileImage(file) {
  //   let urlx = "https://api.imgur.com/3/image";
  //   const clientid = "ff80852491ab3a1";
  //   const config = {
  //     headers: {
  //       "content-type": "multipart/form-data",
  //       Authorization: "Client-ID " + clientid,
  //     },
  //   };
  //   var formdata = new FormData();
  //   formdata.append("image", file);

  //   return axios.post(urlx, formdata, config);
  // }

  static async saveToDatabase(uid, link) {
    let url1 = baseUrl + "/user/" + uid + "/avatar/save";

    let avatarInfo = { link: link };

    return axios.post(url1, avatarInfo);
  }

  static async saveToDatabaseProfileImage(uid, link) {
    let url1 = baseUrl + "/user/" + uid + "/profileImage/save";

    let profileInfo = { link: link };

    return axios.post(url1, profileInfo);
  }

  static async updateProfile(user, uid) {
    let url1 = baseUrl + "/user/" + uid;

    return axios.put(url1, user);
  }

  static async changePassword(passAndRepass, uid) {
    let url1 = baseUrl + "/user/" + uid + "/password";
    return axios.post(url1, passAndRepass);
  }

  static async forgotPassword(email) {
    let currentServer = window.location.href;
    let arr = currentServer.split("/");
    let result = arr[0] + "//" + arr[2]+"/reset-password";
    let form = { email: email, linkReset: result };
    let url1 = baseUrl + "/forgot-password";
    return axios.post(url1, form);
  }

  static async resetPassword(passAndRepassAndToken) {
    let url1 = baseUrl + "/reset-password";
    return axios.post(url1, passAndRepassAndToken);
  }

  static async checkToken(token){
    let url1 = baseUrl + "/reset-password/checkToken/"
    +token;
    return axios.get(url1);
  }
}

export default UserService;
