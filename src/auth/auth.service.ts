import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { SignUpInputDto } from './dto/signUp.dto';
import { ConfigsService } from 'src/configs/configs.service';
import { JwtDto } from './dto/jwt.dto';
import { RedisService } from 'src/redis/redis.service';
import { JwtService } from 'src/jwt/jwt.service';
import { RefreshInputDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  private redisPrefix = 'token:';

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configsService: ConfigsService,
    private redisService: RedisService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.usersService.findByEmail(email);

    const isPasswordValid = await this.usersService.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
    }

    return user;
  }

  private async signToken(payload: JwtDto): Promise<AuthDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload),
      this.jwtService.sign(payload, { expiresIn: this.configsService.jwt.refreshTokenLifeTime }),
    ]);

    const { refreshTokenLifeTime } = this.configsService.jwt;

    const refreshTokenLifeTimeRedisFormat = Math.floor(
      Number(refreshTokenLifeTime.replace('d', '')) * 24 * 60 * 60,
    ); // 7776000

    await this.redisService.set(
      `${this.redisPrefix}${payload.sub}`,
      refreshToken,
      refreshTokenLifeTimeRedisFormat,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async signIn(user: UserDto): Promise<AuthDto> {
    try {
      const payload = {
        email: user.email,
        sub: user.id,
      };

      return this.signToken(payload);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async signUp(signUpInputDto: SignUpInputDto) {
    try {
      const { email, password, confirmationPassword } = signUpInputDto;

      const foundEmail = await this.usersService.findByEmail(email);

      if (foundEmail) {
        throw new ForbiddenException('Email already exists');
      }

      if (password !== confirmationPassword) {
        throw new ForbiddenException('Passwords do not match');
      }

      const passwordValidation = await this.usersService.validatePassword(password);

      if (!passwordValidation) {
        throw new ForbiddenException(
          'Password must have at least 8 characters including uppercase letter, lowercase letter, and number',
        );
      }

      const user = await this.usersService.create({ email, password });

      return this.signIn(user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async signOut(userId: string): Promise<boolean> {
    try {
      await this.redisService.del(`${this.redisPrefix}${userId}`);

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async refresh(refreshInputDto: RefreshInputDto): Promise<AuthDto> {
    try {
      const { refreshToken } = refreshInputDto;

      const payload = await this.jwtService.verify(refreshToken);

      if (payload.exp < Date.now() / 1000) {
        throw new ForbiddenException('Refresh token expired');
      }

      const foundRefreshToken = await this.redisService.get(`${this.redisPrefix}${payload.sub}`);

      if (foundRefreshToken !== refreshToken) {
        throw new ForbiddenException('Invalid refresh token');
      }

      return this.signToken({
        email: payload.email,
        sub: payload.sub,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
