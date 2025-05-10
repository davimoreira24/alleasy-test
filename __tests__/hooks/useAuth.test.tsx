import {renderHook, act} from '@testing-library/react-hooks';
import {AuthProvider, useAuth} from '../../src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../src/services/authService';

jest.mock('../../src/services/authService', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: jest.fn(),
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve iniciar com valores padrão', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate();

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.signIn).toBe('function');
    expect(typeof result.current.signOut).toBe('function');
    expect(typeof result.current.registerUser).toBe('function');
  });

  it('deve realizar login corretamente', async () => {
    const mockToken = 'token123';
    (authService.login as jest.Mock).mockResolvedValueOnce({
      token: mockToken,
    });

    const {result, waitForNextUpdate} = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate();

    await act(async () => {
      await result.current.signIn('teste@email.com', 'senha123');
    });

    expect(authService.login).toHaveBeenCalledWith(
      'teste@email.com',
      'senha123',
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@AuthData:user',
      expect.any(String),
    );
    expect(result.current.user).toEqual({
      id: '1',
      email: 'teste@email.com',
      token: mockToken,
    });
  });

  it('deve realizar registro corretamente', async () => {
    const mockToken = 'token123';
    const mockId = 'user123';
    (authService.register as jest.Mock).mockResolvedValueOnce({
      id: mockId,
      token: mockToken,
    });

    const {result, waitForNextUpdate} = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate();

    await act(async () => {
      await result.current.registerUser(
        'teste@email.com',
        'senha123',
        'Usuário Teste',
      );
    });

    expect(authService.register).toHaveBeenCalledWith(
      'teste@email.com',
      'senha123',
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@AuthData:user',
      expect.any(String),
    );
    expect(result.current.user).toEqual({
      id: mockId,
      email: 'teste@email.com',
      name: 'Usuário Teste',
      token: mockToken,
    });
  });

  it('deve realizar logout corretamente', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate();

    result.current.user = {
      id: '1',
      email: 'teste@email.com',
      token: 'token123',
    };

    await act(async () => {
      await result.current.signOut();
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@AuthData:user');
    expect(result.current.user).toBeNull();
  });

  it('deve carregar usuário do AsyncStorage ao iniciar', async () => {
    const mockUser = {
      id: '1',
      email: 'teste@email.com',
      token: 'token123',
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockUser),
    );

    const {result, waitForNextUpdate} = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@AuthData:user');
    expect(result.current.user).toEqual(mockUser);
  });
});
