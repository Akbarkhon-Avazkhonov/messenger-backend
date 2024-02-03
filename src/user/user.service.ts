import { Injectable, StreamableFile } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fs from 'fs';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getMe(headers: any) {
    const client = new TelegramClient(
      new StringSession(headers.session),
      +process.env.API_ID,
      process.env.API_HASH,
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
  async updateProfile(headers: any, firstName: string) {
    const client = new TelegramClient(
      new StringSession(headers.session),
      +process.env.API_ID,
      process.env.API_HASH,
      {},
    );
    // Проверка авторизации
    await client.connect();
    if (client.isUserAuthorized()) {
      const me = await client.invoke(
        new Api.account.UpdateProfile({
          firstName: firstName,
        }),
      );
      await client.disconnect();
      await client.destroy();

      return me;
    } else {
      await client.disconnect();
      await client.destroy();
      return false;
    }
  }
  async getUserPhoto(headers: any, id: number) {
    const client = new TelegramClient(
      new StringSession(headers.session),
      +process.env.API_ID,
      process.env.API_HASH,
      {},
    );
    // Проверка авторизации
    await client.connect();
    if (client.isUserAuthorized()) {
      const user = await client.downloadProfilePhoto(id);
      // image is a buffer containing the profile photo
      // save image from user
      // await fs.writeFile('picture.jpg', user);
      const image = Buffer.from(user);
      const result = new StreamableFile(image, 'image.jpg');
      await client.disconnect();
      await client.destroy();
      return result;
    } else {
      await client.disconnect();
      await client.destroy();
      return false;
    }
  }
  async updateProfilePhoto(headers: any) {
    const client = new TelegramClient(
      new StringSession(headers.session),
      +process.env.API_ID,
      process.env.API_HASH,
      {},
    );
    // Проверка авторизации
    await client.connect();
    if (client.isUserAuthorized()) {
      await client.disconnect();
      await client.destroy();
      return false;
    } else {
      await client.disconnect();
      await client.destroy();
      return false;
    }
  }
  // make here check for role = 1
  async getAllOperators(headers: any ) {
    if (headers) {
      return this.prisma.user.findMany({
        where: {
          role_id: 2,
        },
      });
    }
  }
}
