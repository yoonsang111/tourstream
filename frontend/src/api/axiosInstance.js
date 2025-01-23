// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // 백엔드 API의 기본 URL
  headers: {
    "Content-Type": "application/json", // 모든 요청에 JSON 데이터 전송
  },
});

export default axiosInstance;
