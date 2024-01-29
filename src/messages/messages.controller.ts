import { MessagesService } from './messages.service';
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Headers } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBasicAuth,
  ApiBody,
  ApiConsumes,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Messages')
@ApiSecurity('session')
@ApiBasicAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
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
  @Post('getMessages')
  getMessages(@Headers() headers: any, @Body() body: { id: number }) {
    return this.messagesService.getMessages(headers, body.id);
  }
  @Get('getDialogs')
  getDialogs(@Headers() headers: any) {
    return this.messagesService.getDialogs(headers);
  }
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          example: 123456789,
        },
        message: {
          type: 'string',
          example: 'Hello',
        },
      },
    },
  })
  @Post('sendMessage')
  sendMessage(@Headers() headers: any, @Body() body: any) {
    return this.messagesService.sendMessage(headers, body.id, body.message);
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
  @Post('getMedia')
  getMedia(
    @Headers() headers: any,
    @Body() body: { id: number; message_id: number },
  ) {
    return this.messagesService.getMedia(headers, +body.id, +body.message_id);
  }
  @ApiConsumes('multipart/form-data')
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
  @Post('uploadProfilePhoto')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Headers() headers: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.messagesService.uploadProfilePhoto(headers, file);
  }
}
