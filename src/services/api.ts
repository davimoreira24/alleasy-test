import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://reqres.in/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'reqres-free-v1',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const userData = await AsyncStorage.getItem('@AuthData:user');

      if (userData && config.headers) {
        const user = JSON.parse(userData);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const {status} = error.response;

      if (status === 401) {
        AsyncStorage.removeItem('@AuthData:user');
      }
    }

    return Promise.reject(error);
  },
);

export default api;
