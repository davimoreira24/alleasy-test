import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

export type User = {
  id: string;
  email: string;
  name?: string;
  token: string;
};

type AuthContextData = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  registerUser: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      setIsLoading(true);
      const storedUser = await AsyncStorage.getItem('@AuthData:user');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);

      const userData: User = {
        id: '1',
        email: email,
        token: response.token,
      };
      setUser(userData);
      await AsyncStorage.setItem('@AuthData:user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function registerUser(email: string, password: string, name?: string) {
    try {
      setIsLoading(true);
      const response = await authService.register(email, password);
      const userData: User = {
        id: response.id || '1',
        email: email,
        name: name,
        token: response.token,
      };
      setUser(userData);
      await AsyncStorage.setItem('@AuthData:user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('@AuthData:user');
      setUser(null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        registerUser,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
