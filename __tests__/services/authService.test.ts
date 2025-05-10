import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../src/services/authService';
import api from '../../src/services/api';

jest.mock('../../src/services/api', () => ({
  post: jest.fn(),
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const mockResponse = {
        data: {
          token: 'token-123',
        },
      };

      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authService.login('teste@email.com', 'senha123');

      expect(api.post).toHaveBeenCalledWith('/login', {
        email: 'teste@email.com',
        password: 'senha123',
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('deve lançar erro quando a API falha', async () => {
      const mockError = new Error('Falha de login');
      (api.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(
        authService.login('teste@email.com', 'senha-errada'),
      ).rejects.toThrow('Falha de login');

      expect(api.post).toHaveBeenCalledWith('/login', {
        email: 'teste@email.com',
        password: 'senha-errada',
      });
    });
  });

  describe('register', () => {
    it('deve registrar usuário com sucesso', async () => {
      const mockResponse = {
        data: {
          id: 'user-123',
          token: 'token-123',
        },
      };

      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authService.register('novo@email.com', 'senha123');

      expect(api.post).toHaveBeenCalledWith('/register', {
        email: 'novo@email.com',
        password: 'senha123',
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('deve lançar erro quando o registro falha', async () => {
      const mockError = new Error('Falha no registro');
      (api.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(
        authService.register('email@invalido.com', 'senha-fraca'),
      ).rejects.toThrow('Falha no registro');

      expect(api.post).toHaveBeenCalledWith('/register', {
        email: 'email@invalido.com',
        password: 'senha-fraca',
      });
    });
  });

  describe('logout', () => {
    it('deve limpar o armazenamento ao fazer logout', async () => {
      await authService.logout();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@AuthData:user');
    });

    it('deve lançar erro quando a limpeza falha', async () => {
      const mockError = new Error('Falha ao limpar storage');
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(authService.logout()).rejects.toThrow(
        'Falha ao limpar storage',
      );
    });
  });

  describe('isAuthenticated', () => {
    it('deve retornar true quando o usuário está autenticado', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({
          id: '1',
          email: 'teste@email.com',
          token: 'token-123',
        }),
      );

      const result = await authService.isAuthenticated();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@AuthData:user');
      expect(result).toBe(true);
    });

    it('deve retornar false quando o usuário não está autenticado', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await authService.isAuthenticated();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@AuthData:user');
      expect(result).toBe(false);
    });

    it('deve retornar false quando ocorre um erro', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error('Erro ao buscar'),
      );

      const result = await authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
