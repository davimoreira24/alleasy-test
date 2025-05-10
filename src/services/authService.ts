import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  id?: string;
  token: string;
}

const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/login', {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>('/register', {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('@AuthData:user');
    } catch (error) {
      throw error;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const userData = await AsyncStorage.getItem('@AuthData:user');
      return !!userData;
    } catch (error) {
      return false;
    }
  },
};

export default authService;
