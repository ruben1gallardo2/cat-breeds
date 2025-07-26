import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginUser, registerUser } from '../../services/auth.service';
import userModel from '../../models/user.model';

jest.mock('../../models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  const mockUserData = {
    _id: '123abc',
    id: '123abc',
    email: 'test@email.com',
    password: 'hashedpassword',
    name: 'Test User',
    age: '25',
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      (userModel as unknown as jest.Mock).mockImplementation(() => mockUserData);

      const result = await registerUser('test@email.com', 'password123', 'Test User', '25');

      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@email.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserData.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: '123abc',
        email: 'test@email.com',
        name: 'Test User',
        age: '25',
      });
    });

    it('should throw error if email already exists', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(mockUserData);

      await expect(
        registerUser('test@email.com', 'password123', 'Test User', '25')
      ).rejects.toThrow('Email already in use');
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a token', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(mockUserData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mocked.token');

      const result = await loginUser('test@email.com', 'password123');

      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@email.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: '123abc',
          email: 'test@email.com',
          name: 'Test User',
          age: '25',
        },
        expect.any(String), // JWT_SECRET
        { expiresIn: '10m' }
      );
      expect(result).toEqual({
        token: 'mocked.token',
        user: {
          id: '123abc',
          email: 'test@email.com',
        },
      });
    });

    it('should throw if email not found', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(loginUser('notfound@email.com', '123')).rejects.toThrow('Invalid credentials');
    });

    it('should throw if password does not match', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(mockUserData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(loginUser('test@email.com', 'wrongpass')).rejects.toThrow('Invalid credentials');
    });
  });
});
