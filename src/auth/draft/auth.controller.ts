import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { PasswordDto } from '../dto/Password.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('signInWithQrCode')
  async signInWithQrCode() {
    return this.authService.signInWithQrCode();
  }
  @Post('signInWithPassword')
  async loginWithPassword(@Body() password: PasswordDto) {
    return this.authService.signInWithPassword(
      password.phoneNumber,
      password.phoneCode,
    );
  }
}
