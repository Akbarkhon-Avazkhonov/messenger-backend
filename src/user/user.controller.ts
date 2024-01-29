import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Headers } from '@nestjs/common';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
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
  getUserPhoto(@Headers() headers: any, @Body('id') id: number) {
    return this.userService.getUserPhoto(headers, id);
  }

  @Get('getAllOperators')
  getAllOperators(@Headers() headers: any) {
    return this.userService.getAllOperators(headers);
  }

  @Post('updateProfilePhoto')
  updateProfilePhoto(@Headers() headers: any) {
    return this.userService.updateProfilePhoto(headers);
  }
}

// {
//   "session": "1AgAOMTQ5LjE1NC4xNjcuNTABuwL0e3LH1k72lWpBr4Iczw4oR+k1yTY00fJp9ToKe5rBxJI3/o7EGL1JL7ns7dgyYHd4To/0y4Xik7I2EYerKvVlrP4MPv7JmrjEUV4NE8Bt8cM9H1F71b2XDAVjTBzmpBel2bdn2JqzgpPNuAyYngVo7jOWm/mpCsEMRRMPjwFDFy5TnIoslJNVrylGlKdNITYkBzWSQQTCbcCSP7mrHMP2pIPYgyrV+0hN3w/jEporYdBWlbzf4sqKF5DstaD8awsXGZcfKuA5CJambl8rDnCS8pa5OCWvsoV9ZXKG6cT1bWinRPIVbamTR+Lt1Hq3/1MebVXUQ+gRjRNcYTAOKWM="
// }
