import { Injectable } from '@nestjs/common';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
const apiId = 25660944;
const apiHash = '11cea33e2fe457036679c192bc4f2014';
@Injectable()
export class UserService {
  async getMe(headers: any) {
    const client = new TelegramClient(
      new StringSession(headers.usersession),
      apiId,
      apiHash,
      {},
    );
    // Проверка авторизации
    await client.connect();
    if (client.isUserAuthorized()) {
      const me = await client.getMe();
      await client.disconnect();
      await client.destroy();
      return me;
    } else {
      await client.disconnect();
      await client.destroy();
      return false;
    }
  }

  async getDialogs(headers: any) {
    const client = new TelegramClient(
      new StringSession(headers.usersession),
      apiId,
      apiHash,
      {},
    );
    // Проверка авторизации
    await client.connect();
    if (client.isUserAuthorized()) {
      const dialogs = await client.getDialogs({ limit: 10 });
      await client.disconnect();
      await client.destroy();
      const result = dialogs.map((dialog) => ({
        id: dialog.id,
        title: dialog.title,
        unreadCount: dialog.unreadCount,
        message: dialog.message,
        date: dialog.date,
        // Добавьте здесь другие свойства, которые вам нужны
      }));
      return result;
    } else {
      await client.disconnect();
      await client.destroy();
      return false;
    }
  }

  async getMessages(headers: any, id: number) {
    const client = new TelegramClient(
      new StringSession(headers.usersession),
      apiId,
      apiHash,
      {
        connectionRetries: 5,
        deviceModel: 'Phoenix',
        systemVersion: '2.0.1',
      },
    );
    // Проверка авторизации
    await client.connect();
    if (client.isUserAuthorized()) {
      await client.getPeerId('@akbarkhonavazkhonov');
      const messages = await client.getMessages(id.toString());
      await client.disconnect();
      await client.destroy();
      console.log(messages);
      const result = messages.map((message) => ({
        id: message.id,
        message: message.message,
        date: message.date,
        isMe: message.out,
        // Добавьте здесь другие свойства, которые вам нужны
      }));
      return result;
    } else {
      await client.disconnect();
      await client.destroy();
      return false;
    }
  }
}
