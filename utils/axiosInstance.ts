'use client'
import axios from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://herstyleapi.onrender.com/api/v1',
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

// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
  
//   failedQueue = [];
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({resolve, reject});
//         }).then(token => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return axiosInstance(originalRequest);
//         }).catch(err => {
//           return Promise.reject(err);
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         console.log("hellooooo")
//         const response = await axiosInstance.post('/users/refresh-token');
//         console.log("Refresh token request successful");
//         const { accessToken } = response.data;
//         console.log("New access token received:", accessToken);
//         setCookie('auth_token', accessToken, {
//           maxAge: 24 * 60 * 60, // 1 day
//           path: '/',
//           sameSite: 'strict'
//         });
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//         processQueue(null, accessToken);
//         return axiosInstance(originalRequest);
//       } catch (refreshError: any) {
//         processQueue(refreshError, null);
//         if (axios.isAxiosError(refreshError)) {
//           if(refreshError.response?.data.errorCode === "NO_REFRESH_TOKEN"){
//             deleteCookie('auth_token');
//             localStorage.removeItem('user');
//             localStorage.removeItem('role');
//           }
//         }
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
