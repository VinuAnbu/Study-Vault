import { toast } from 'react-toastify';
import axios from './api';
import { useNavigate } from 'react-router-dom';

export const login = async (email, password) => {
// const navigate=useNavigate()

  const res = await axios.post('/api/auth/login', { email, password });
  toast(res.data.message)
  if(res.data.success){
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));

  return res.data;
  
  }
 
};

export const signup = async (userData) => {
  const res = await axios.post('/api/auth/signup', userData);


  toast.success(res.data.message)
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
