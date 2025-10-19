// src/services/authApi.js
import axios from 'axios';
import { environment } from '../config/environment';

// Axios 인스턴스 생성
const instance = axios.create({
  baseURL: `${environment.API_URL}/api/auth`,
  withCredentials: true, // 쿠키 포함 요청
  timeout: 10000,
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    console.log('API 요청:', config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 세션 만료 시 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API 함수
const authApi = {
  // 일반 인증
  register: (name, email, password) =>
    instance.post('/register', { name, email, password }),

  login: (email, password) =>
    instance.post('/login', { email, password }),

  logout: () =>
    instance.post('/logout'),

  getCurrentUser: () =>
    instance.get('/me'),

  // OAuth
  getGoogleAuthUrl: () =>
    instance.get('/google/url'),

  getNaverAuthUrl: () =>
    instance.get('/naver/url'),

  handleOAuthCallback: (provider, code) =>
    instance.post(`/${provider}/callback`, { code }),

  // 관리자 전용 API
  admin: {
    getUsers: () =>
      instance.get('/admin/users'),

    updateUserType: (userId, userType) =>
      instance.put(`/admin/users/${userId}`, { userType }),

    deleteUser: (userId) =>
      instance.delete(`/admin/users/${userId}`)
  }
};

export default authApi;
