import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto, UserInputDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userEntity: Repository<UserEntity>,
  ) {}

  private mapUser(user: UserEntity): UserDto {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
    };
  }

  private encryptPassword = (password: string) =>
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) => hash);

  comparePassword = (password: string, hashPassword: string) =>
    bcrypt.compare(password, hashPassword).then((resp) => resp);

  validatePassword = (password: string) => {
    // Password must have at least 8 char including uppercase, lowercase, and number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

    return password.match(passwordRegex);
  };

  async findByEmail(email: string): Promise<UserDto | undefined> {
    try {
      const foundUser = await this.userEntity.findOne({ email });

      if (!foundUser) {
        return undefined;
      }

      return this.mapUser(foundUser);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findById(id: string): Promise<UserDto | undefined> {
    try {
      const foundUser = await this.userEntity.findOne({ id });

      if (!foundUser) {
        return undefined;
      }

      return this.mapUser(foundUser);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(user: UserInputDto): Promise<UserDto> {
    try {
      const { email, password } = user;

      const hashPassword = await this.encryptPassword(password);

      const createdUser = await this.userEntity.save(
        this.userEntity.create({
          email,
          password: hashPassword,
        }),
      );

      return this.mapUser(createdUser);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
