import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PasswordDto } from './dto/Password.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    description:
      'First time send  WITHOUT PHONE CODE !. After that send WITH PHONE CODE !',
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          example: '+998.........',
        },
        phoneCode: {
          type: 'string',
          example: '',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'WILL BE RETURN SESSION STRING ! ',
    schema: {
      type: 'object',
      properties: {
        session: {
          type: 'string',
          example:
            '1AgAOMTQ5LjE1NC4xNjcuNTABu2XRswl8BWMkDy8ohXz06pH6NBwUDMLUO6OzysJ0MAEVpVyGntgujuDfNvtLr4ccnDSNg8YQZUhMcS7HJUOS9/8va8CA/ZikNvItOLIbvObuP35qiSmwaPOBCRC1126sBAvc5fsFNMF6pvmm0d1SQtH0Db2ncq6W8lirQu2alswNSESfvszoH1hRvBo2301Bjrqv9+2nwmG9OylqLz+calVEC1WPBenp0xXnLNQVnHi/rlGNMrLyoUvnJvq/3KiiPI9bJxktA3zhUKBq2A5yMudy/yaM3ZMDpi2LVuxD15wRZD9XMRe2skIbG8vfKXimvjE+dPCqOJhjQ+HHQXN0aws=',
        },
      },
    },
  })
  @ApiAcceptedResponse({
    description: 'EMPTY_PHONE_CODE',
  })
  @Post('signInWithPassword')
  async loginWithPassword(@Body() password: PasswordDto) {
    return await this.authService.signInWithPassword(
      password.phoneNumber,
      password.phoneCode,
    );
  }
}
