import axios from "axios";

const instance = axios.create({
  //本地3000端口
  baseURL: "http://localhost:3000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在这里可以添加token等请求头信息
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 在这里可以处理响应数据
    return response.data;
  },
  (error) => {
    // 在这里可以处理错误响应
    return Promise.reject(error);
  }
);

export default instance;
