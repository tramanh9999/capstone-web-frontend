import axios from "axios";
import { API_URL } from "../config/api";

class FIleService {
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
}

export default FIleService;
