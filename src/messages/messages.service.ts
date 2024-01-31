import { Injectable, StreamableFile } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Api } from 'telegram';
import { CustomFile } from 'telegram/client/uploads';
import * as fs from 'fs';
import { telegramClient } from 'src/telegramClient';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}
  async getDialogs(
    headers: any,
    limit: number = 10,
    webhook: string = process.env.TEST_WEBHOOK,
  ) {
    const client = telegramClient(headers.session);
    // Проверка авторизации
    await client.connect();
    if (client.isUserAuthorized()) {
      const dialogs = await client.getDialogs({ limit: limit });
      client.addEventHandler((update: Api.UpdateNewMessage) => {
        console.log('Received new Update');
        this.httpService.post(webhook, update).subscribe({
          complete: () => {
            console.log('completed');
          },
          error: (err) => {
            console.log('Error: ' + err);
          },
        });
      });

      // const result = dialogs.map((dialog) => ({
      //   id: dialog.id,
      //   title: dialog.title,
      //   unreadCount: dialog.unreadCount,
      //   message: dialog.message,
      //   date: dialog.date,
      //   // Добавьте здесь другие свойства, которые вам нужны
      // }));
      const result = dialogs.map((dialog) => ({
        userId: dialog.id,
        title: dialog.title,
        unreadCount: dialog.unreadCount,
        message: dialog.message.message,
        date: dialog.date,
      }));

      return result;
    } else {
      await client.disconnect();
      await client.destroy();
      return false;
    }
  }
  async getMessages(headers: any, id: number) {
    const client = telegramClient(headers.session);
    // Проверка авторизации
    await client.connect();
    if (client.isUserAuthorized()) {
      await client.getDialogs({ limit: 100 });

      const messages = await client.getMessages(id.toString(), {});
      // save to prisma from messages until not exist
      let i = 0;
      while (true) {
        const message = await this.prisma.message.findFirst({
          where: {
            unique_id: +(id.toString() + messages[i].id.toString()),
          },
        });
        if (message) {
          break;
        }
        await this.prisma.message.create({
          data: {
            unique_id: +(id.toString() + messages[i].id.toString()),
            user_id: +id,
            message_id: messages[i].id,
            other: JSON.stringify(messages[i]),
          },
        });
        i++;
      }

      const messages_db = await this.prisma.message.findMany({
        where: {
          user_id: +id,
        },
      });
      await client.disconnect();
      await client.destroy();
      if (messages_db.length == messages.length) {
        return messages;
      } else {
        // find not exist messages and make them is_deleted = true
        const deleted_messages_unique_id = messages_db.filter(
          (message_db) =>
            !messages.find(
              (message) =>
                message_db.unique_id.toString() ==
                id.toString() + message.id.toString(),
            ),
        );
        await this.prisma.message.updateMany({
          where: {
            unique_id: {
              in: deleted_messages_unique_id.map(
                (message) => message.unique_id,
              ),
            },
          },
          data: {
            is_deleted: true,
          },
        });

        const messages_from_db = await this.prisma.message.findMany({
          where: {
            user_id: +id,
          },
        });
        // simple map to JSON and add is_deleted for each message
        const result = messages_from_db.map((message) => {
          const parsedMessage = JSON.parse(message.other);
          return { ...parsedMessage, is_deleted: message.is_deleted }; // You can set is_deleted to any default value
        });
        return result;
      }
    } else {
      await client.disconnect();
      await client.destroy();
      return false;
    }
  }
  async sendMessage(headers: any, id: number, message: string) {
    const client = telegramClient(headers.session);
    // Проверка авторизации
    await client.connect();
    if (client.isUserAuthorized()) {
      await client.getPeerId('@akbarkhonavazkhonov');
      const messages = await client.sendMessage(id.toString(), {
        message: message,
      });
      await client.disconnect();
      await client.destroy();
      return messages;
    } else {
      await client.disconnect();
      await client.destroy();
      return false;
    }
  }
  async getMedia(headers: any, id: number, message_id: number) {
    const client = telegramClient(headers.session);
    await client.connect();
    // Проверка авторизации
    if (client.isUserAuthorized()) {
      const messages = await client.getMessages(id.toString(), {});
      // make me simple function find message from messages where id = id
      const message = messages.find((message) => message.id === message_id);
      const file = await client.downloadMedia(message);
      await client.disconnect();
      await client.destroy();
      console.log(file);
      const result = Buffer.from(file);
      return new StreamableFile(result, 'audio.ogg');
    } else {
      await client.disconnect();
      await client.destroy();
      return false;
    }
  }
  async uploadProfilePhoto(headers: any, file: any) {
    const client = telegramClient(headers.session);
    await client.connect();
    // Проверка авторизации
    // save file to local storage ts

    // Save file locally
    const localFilePath = file.originalname;
    fs.writeFileSync(localFilePath, file.buffer);

    if (client.isUserAuthorized()) {
      const filesrc = file.originalname;
      const result = await client.uploadFile({
        file: new CustomFile(filesrc, 100000, filesrc),
        workers: 1,
      });
      await client.invoke(
        new Api.photos.UploadProfilePhoto({
          file: result,
        }),
      );
      console.log(result);
      await client.disconnect();
      await client.destroy();
      return result;
    } else {
      await client.disconnect();
      await client.destroy();
      return false;
    }
  }
}
