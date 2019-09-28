import axios from "axios";

export default axios.create({
 baseURL: process.env.NODE_ENV == 'development'?'http://localhost:5000/codeword/api/v1':'/codeword/api/v1',
 // baseURL: "/codeword/api/v1/",
  responseType: "json"
});