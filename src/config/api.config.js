import axios from "axios";
import useUserStore from '../store/useUserStore';

export const api = axios.create({
    baseURL: "https://api.modernwash.co.kr/api/v1",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const bannerApi = axios.create({
  baseURL: "https://api.modernwash.co.kr/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const memberApi = axios.create({
  baseURL: "https://api.modernwash.co.kr/api/v1/member",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const subApi = axios.create({
  baseURL: "https://api.modernwash.co.kr/api/v1/subscriptions",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 모든 요청에 Authorization 헤더 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().userToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

bannerApi.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().userToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

memberApi.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().userToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

subApi.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().userToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);