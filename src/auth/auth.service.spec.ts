import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { userEntityProvider } from '../test/providers/entities/users.provider';
import { usersServiceProvider } from '../test/providers/users.provider';
import { jwtServiceProvider } from '../test/providers/jwt.provider';
import { configsServiceProvider } from '../test/providers/configs.provider';
import { redisServiceProvider } from '../test/providers/redis.provider';
import { usersData } from '../test/mock/users.mock';
import { refreshTokenData } from '../test/mock/refreshToken.mock';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        usersServiceProvider,
        jwtServiceProvider,
        configsServiceProvider,
        redisServiceProvider,
        userEntityProvider,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user', async () => {
      const user = usersData[0];

      const result = await service.validateUser(user.email, user.password);

      expect(result).toMatchObject(user);
    });

    it('should throw ForbiddenException', async () => {
      try {
        const user = usersData[0];

        await service.validateUser(user.email, 'invalid-password');
      } catch (error) {
        expect(error.status).toBe(403);
        expect(error.message).toBe('Invalid password');
      }
    });
  });

  describe('signIn', () => {
    it('should return auth', async () => {
      const user = usersData[0];

      const result = await service.signIn(user);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });

  describe('signUp', () => {
    it('should return auth', async () => {
      const user = {
        email: 'test@gmail.com',
        password: 'mMoS9JNd',
        confirmationPassword: 'mMoS9JNd',
      };

      const result = await service.signUp(user);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should not allow existing email', async () => {
      const user = {
        email: 'prach.yot@gmail.com',
        password: 'mMoS9JNd',
        confirmationPassword: 'mMoS9JNd',
      };

      try {
        await service.signUp(user);
      } catch (error) {
        expect(error.status).toBe(500);
        expect(error.message).toBe('Email already exists');
      }
    });

    it('should not allow if password and confirmPassword are not equal', async () => {
      const user = {
        email: 'test@gmail.com',
        password: 'mMoS9JNd',
        confirmationPassword: 'mMoS9JNd-NOT-EQUAL',
      };

      try {
        await service.signUp(user);
      } catch (error) {
        expect(error.status).toBe(500);
        expect(error.message).toBe('Passwords do not match');
      }
    });

    it('should not allow invalid password', async () => {
      const user = {
        email: 'test@gmail.com',
        password: '12345',
        confirmationPassword: '12345',
      };

      try {
        await service.signUp(user);
      } catch ({ response }) {
        expect(response.status).toBe(403);
        expect(response.message).toBe(
          'Password must have at least 8 characters including uppercase letter, lowercase letter, and number',
        );
      }
    });
  });

  describe('signOut', () => {
    it('should return true', async () => {
      const user = usersData[0];

      const result = await service.signOut(user.id);

      expect(result).toBe(true);
    });
  });

  describe('refresh', () => {
    it('should return auth', async () => {
      const result = await service.refresh({
        refreshToken: refreshTokenData,
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });
});
