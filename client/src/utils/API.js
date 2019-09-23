import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/codeword/api/v1/",
  responseType: "json"
});