import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Headers } from '@nestjs/common';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
@ApiTags('User')
@ApiSecurity('session')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('getMe')
  getMe(@Headers() headers: any) {
    return this.userService.getMe(headers);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          example: 'John',
        },
      },
    },
  })
  @Post('updateProfile')
  updateProfile(@Headers() headers: any, @Body() body: any) {
    return this.userService.updateProfile(headers, body.firstName);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          example: 123456789,
        },
      },
    },
  })
  @Post('getUserPhoto')
  // get photo
  getUserPhoto(
    @Headers() headers: any,
    @Body('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.getUserPhoto(headers, id, res);
  }

  @Get('getAllOperators')
  getAllOperators(@Headers() headers: any) {
    return this.userService.getAllOperators(headers);
  }
}

/* 
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })

  @Post('updateProfilePhoto')
  updateProfilePhoto(@Headers() headers: any) {
    return this.userService.updateProfilePhoto(headers);
  }

@ApiConsumes('multipart/form-data')
  @Post('uploadProfilePhoto')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Headers() headers: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // return this.messagesService.uploadProfilePhoto(headers, file);
    return true;
  }
*/
