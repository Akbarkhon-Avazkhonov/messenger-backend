import { Body, Controller, Post, Headers, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    description: 'Send phone number',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'John',
        },
        password: {
          type: 'string',
          example: '123456',
        },
        phoneNumber: {
          type: 'string',
          example: '+9996624545',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description:
      'WILL BE RETURN PHONE_CODE_HASH AND SESSION ! AND SEND CODE TO PHONE VIA TELEGRAM !',
    schema: {
      type: 'object',
      properties: {
        phoneCodeHash: {
          type: 'string',
          example: '8c592dd63ddf152970',
        },
        session: {
          type: 'string',
          example: '.....',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'PHONE_NUMBER_INVALID',
  })
  @Post('sendCode')
  async sendCode(
    @Body() data: { name: string; password: string; phoneNumber: string },
  ) {
    return await this.authService.sendCode(
      data.name,
      data.password,
      data.phoneNumber,
    );
  }

  @ApiCreatedResponse({
    description: 'WILL BE RETURN AUTHERIZED USER SESSION ! SAVE IT IN COOKIE !',
    schema: {
      type: 'object',
      properties: {
        phoneCodeHash: {
          type: 'string',
          example: '8c592dd63ddf152970',
        },
        session: {
          type: 'string',
          example: '.....',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'WILL THROW ERROR WITH MESSAGE !',
  })
  @ApiBody({
    description:
      'Sign in with code after send code. This time send session in body (because user not authorized) ',
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          example: '+9996624545',
        },
        phoneCode: {
          type: 'string',
          example: '22222',
        },
        phoneCodeHash: {
          type: 'string',
          example: '8c592dd63ddf152970',
        },
        session: {
          type: 'string',
          example: '',
        },
      },
    },
  })
  @Post('signInWithCode')
  async signInWithCode(
    @Body()
    body: {
      phoneNumber: string;
      phoneCodeHash: string;
      phoneCode: string;
      session: string;
    },
  ) {
    return await this.authService.signInWithCode(
      body.phoneNumber,
      body.phoneCodeHash,
      body.phoneCode,
      body.session,
    );
  }

  @ApiBody({
    description: 'Send name and password',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'John',
        },
        password: {
          type: 'string',
          example: '123456',
        },
      },
    },
  })
  @Post('signInWithName')
  async loginWithName(@Body() password: { name: string; password: string }) {
    return await this.authService.signInWithName(
      password.name,
      password.password,
    );
  }
  @ApiSecurity('session')
  @ApiBody({
    description: 'Send username',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'John',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'true or false',
  })
  @HttpCode(200)
  @Post('checkUsername')
  async checkUsername(
    @Headers() headers: any,
    @Body() username: { username: string },
  ) {
    return await this.authService.checkUsername(headers, username.username);
  }
}
