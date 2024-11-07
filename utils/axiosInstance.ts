'use client'
import axios from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { cookies } from 'next/headers';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.her-style.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials:true
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('auth_token')
    config.headers.Authorization = !config.headers._retry && token ?` Bearer ${token}` : config.headers.Authorization;
    return config;
  }
);



axiosInstance.interceptors.response.use(
  (response) => response,
  async (error:any) => {
    if(error.status === 401){
      localStorage.removeItem("user")
      localStorage.removeItem("role")
      deleteCookie("auth_token")
    }
  }
);

export default axiosInstance;
