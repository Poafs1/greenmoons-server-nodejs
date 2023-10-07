import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { userEntityProvider } from '../test/providers/entities/users.provider';
import * as bcrypt from 'bcrypt';
import { usersData } from '../test/mock/users.mock';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, userEntityProvider],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('comparePassword', () => {
    it('should return true if password is correct', async () => {
      const password = 'password';

      const hashPassword = await bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hash) => hash);

      const result = await service.comparePassword(password, hashPassword);

      expect(result).toEqual(true);
    });

    it('should return false if password is incorrect', async () => {
      const password = 'password';

      const hashPassword = await bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hash) => hash);

      const result = await service.comparePassword('wrongPassword', hashPassword);

      expect(result).toEqual(false);
    });
  });

  describe('validatePassword', () => {
    it('should define if password is valid with at least 8 characters including uppercase letter, lowercase letter, and number', () => {
      const password = 'mMoS9JNd';

      const result = service.validatePassword(password);

      expect(result).toBeTruthy();
    });

    it('should return null if password is invalid with less than 8 characters', () => {
      const password = 'S9JN';

      const result = service.validatePassword(password);

      expect(result).toBeNull();
    });

    it('should return null if password is invalid without uppercase letter', () => {
      const password = 'mos9jnd';

      const result = service.validatePassword(password);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      const user = usersData[0];

      const result = await service.findByEmail(user.email);

      expect(result).toMatchObject(user);
    });

    it('should return undefined if not found', async () => {
      const result = await service.findByEmail('test@gmail.com');

      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create user', async () => {
      const user = {
        email: 'test@gmail.com',
        password: 'password',
      };

      const result = await service.create(user);

      expect(result).toMatchObject({
        email: user.email,
        password: expect.any(String),
      });
    });

    it('should throw error if user already exists', async () => {
      const user = usersData[0];

      try {
        await service.create(user);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
