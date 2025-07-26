import { register, login } from '../../controllers/auth.controller';
import * as authService from '../../services/auth.service';
import { Request, Response } from 'express';

describe('Auth Controller', () => {

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  })
  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  describe('register', () => {
    it('should return 400 if email is missing', async () => {
      const req = { body: { password: 'pass' } } as Request;
      const res = mockResponse();

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing email' });
    });

    it('should return 400 if password is missing', async () => {
      const req = { body: { email: 'test@test.com' } } as Request;
      const res = mockResponse();

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing password' });
    });

    it('should register user and return 200', async () => {
      const req = {
        body: { email: 'test@test.com', password: '123', name: 'User', age: '20' },
      } as Request;
      const res = mockResponse();

      const mockUser = { id: '1', email: 'test@test.com', name: 'User', age: '20' };
      jest.spyOn(authService, 'registerUser').mockResolvedValue(mockUser as any);

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle registration error', async () => {
      const req = {
        body: { email: 'fail@test.com', password: '123', name: 'User', age: '20' },
      } as Request;
      const res = mockResponse();

      jest
        .spyOn(authService, 'registerUser')
        .mockRejectedValue(new Error('DB Error'));

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error while user registration',
        error: expect.any(Error),
      });
    });
  });

  describe('login', () => {
    it('should return 400 if email is missing', async () => {
      const req = { body: { password: '123' } } as Request;
      const res = mockResponse();

      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing email' });
    });

    it('should return 400 if password is missing', async () => {
      const req = { body: { email: 'test@test.com' } } as Request;
      const res = mockResponse();

      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing password' });
    });

    it('should login user and return 200', async () => {
      const req = {
        body: { email: 'test@test.com', password: '123' },
      } as Request;
      const res = mockResponse();

      const mockLoginResponse = {
        token: 'mocked-token',
        user: { id: '1', email: 'test@test.com' },
      };

      jest.spyOn(authService, 'loginUser').mockResolvedValue(mockLoginResponse);

      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLoginResponse);
    });

    it('should handle login error', async () => {
      const req = {
        body: { email: 'fail@test.com', password: 'wrong' },
      } as Request;
      const res = mockResponse();

      jest.spyOn(authService, 'loginUser').mockRejectedValue(new Error('Invalid credentials'));

      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error login user',
        error: expect.any(Error),
      });
    });
  });
});
