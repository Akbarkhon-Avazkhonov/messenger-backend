/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessagesService } from './messages.service';
import {
  Body,
  Controller,
  Post,
  Response,
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
        maxId: {
          type: 'number',
          example: 123456789,
          description: 'max id of message',
        },
      },
    },
  })
  @Post('getMessages')
  getMessages(
    @Headers() headers: any,
    @Body() body: { id: number; maxId: number },
  ) {
    return this.messagesService.getMessages(headers, body.id, body.maxId);
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
        phone: {
          type: 'string',
          example: '+123456789',
        },
        firstName: {
          type: 'string',
          example: 'John',
        },
        message: {
          type: 'string',
          example: 'Hello',
        },
      },
    },
  })
  @Post('sendFirstMessage')
  sendFirstMessage(@Headers() headers: any, @Body() body: any) {
    return this.messagesService.sendFirstMessage(
      headers,
      body.phone,
      body.firstName,
      body.message,
    );
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
    @Response() res: any,
  ) {
    return this.messagesService.getMedia(
      headers,
      +body.id,
      +body.message_id,
      res,
    );
  }
}
