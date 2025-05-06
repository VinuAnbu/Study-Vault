import axios from 'axios';
import { getToken } from './authService';

const instance = axios.create({
  baseURL: 'http://localhost:5000'
});

instance.interceptors.request.use(
  config => {
    const token = getToken();
    if(token){
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default instance;
