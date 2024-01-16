import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Headers } from '@nestjs/common';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // get router with header
  @Get('getMe')
  getMe(@Headers() headers: any) {
    return this.userService.getMe(headers);
  }

  @Get('getDialogs')
  getDialogs(@Headers() headers: any) {
    return this.userService.getDialogs(headers);
  }

  @Post('getMessages')
  getMessages(@Headers() headers: any, @Body('id') id: number) {
    return this.userService.getMessages(headers, id);
  }
}
