import { Module } from '@nestjs/common';
import { JwtModule as JwtBaseModule } from '@nestjs/jwt';
import { ConfigsModule } from '../configs/configs.module';
import { ConfigsService } from '../configs/configs.service';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    JwtBaseModule.registerAsync({
      imports: [ConfigsModule],
      inject: [ConfigsService],
      useFactory: (configsService: ConfigsService) => {
        return {
          secret: configsService.jwt.secret,
          signOptions: { expiresIn: configsService.jwt.accessTokenLifeTime },
        };
      },
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
