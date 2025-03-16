import axios from 'axios';

// 创建 Axios 实例
const instance = axios.create({
    baseURL: 'http://192.168.110.199:3000', // 你的 API 基础地址
    timeout: 5000 // 设置请求超时时间
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么，例如添加请求头
        const token = localStorage.getItem('token'); // 假设从本地存储获取 token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    response => {
        // 对响应数据做些什么
        return response.data;
    },
    error => {
        // 对响应错误做些什么
        if (error.response.status === 401) {
            // 例如，处理未授权的情况，跳转到登录页面
            console.log('未授权，请重新登录');
        }
        return Promise.reject(error);
    }
);

export default instance;