import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3000/codeword/api/v1/",
  responseType: "json"
});