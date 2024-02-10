import { MessagesService } from './messages.service';
import {
  Body,
  Controller,
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        webhook: {
          type: 'string',
          example: process.env.TEST_WEBHOOK,
        },
      },
    },
  })
  @Post('getDialogs')
  getDialogs(@Headers() headers: any, @Body() body: { webhook: string }) {
    return this.messagesService.getDialogs(headers, body.webhook);
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
        message_id: {
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
