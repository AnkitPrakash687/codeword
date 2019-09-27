import axios from "axios";

export default axios.create({
 //baseURL: "/codeword/api/v1/",
  baseURL: "/codeword/api/v1/",
  responseType: "json"
});