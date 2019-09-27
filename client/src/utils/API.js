import axios from "axios";

export default axios.create({
 //baseURL: "/codeword/api/v1/",
  baseURL: "http://localhost:5000/codeword/api/v1/",
  responseType: "json"
});