import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SignUpInputDto } from './dto/signUp.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RefreshInputDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Request() req): Promise<AuthDto> {
    return this.authService.signIn(req.user);
  }

  @Post('signup')
  async signUp(@Body() signUpInputDto: SignUpInputDto): Promise<AuthDto> {
    return this.authService.signUp(signUpInputDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signOut(@Request() req): Promise<boolean> {
    return this.authService.signOut(req.user.userId);
  }

  @Post('refresh')
  async refresh(@Body() refreshInputDto: RefreshInputDto): Promise<AuthDto> {
    return this.authService.refresh(refreshInputDto);
  }
}
