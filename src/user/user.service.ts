import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Api } from 'telegram';

import { telegramClient } from 'src/telegramClient';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getMe(headers: any) {
    // if headers.session length is less than 10 is admin
    if (headers.session.length < 10) {
      return await this.prisma.user.findFirst({
        where: {
          session: headers.session,
        },
      });
    }
    const client = await telegramClient(headers.session);
    if (client.isUserAuthorized()) {
      const me = await client.getMe();
      await client.disconnect();
      return me;
    } else {
      await client.disconnect();
      throw new HttpException('Unauthorized', 401);
    }
  }
  async updateProfile(headers: any, firstName: string) {
    const client = await telegramClient(headers.session);
    try {
      const me = await client.invoke(
        new Api.account.UpdateProfile({
          firstName: firstName,
        }),
      );
      await client.disconnect();
      return me;
    } catch (error) {
      await client.disconnect();
      throw new HttpException(error.errorMessage, error.code || 500);
    }
  }
  async getUserPhoto(headers: any, id: number, res: any) {
    const client = await telegramClient(headers.session);
    try {
      const user = await client.downloadProfilePhoto(id);
      const image = Buffer.from(user);
      await client.disconnect();
      res.set({ 'Content-Type': 'image/jpeg' });
      return res.send(image);
    } catch (error) {
      await client.disconnect();
      throw new HttpException(error.errorMessage, error.code || 500);
    }
  }

  async getAllOperators(headers: any) {
    const admin = await this.prisma.user.findFirst({
      where: {
        session: headers.session,
      },
    });
    if (admin.role_id === 1) {
      return this.prisma.user.findMany({
        where: {
          role_id: 2,
        },
      });
    }
  }
}

/*
  async updateProfilePhoto(headers: any) {
    const client = await telegramClient(headers.session);
    // Проверка авторизации
    if (client.isUserAuthorized()) {
      await client.disconnect();
      return false;
    } else {
      await client.disconnect();
      return false;
    }
  }

 async uploadProfilePhoto(headers: any, file: any) {
    const client = await telegramClient(headers.session);
 
    // Save file locally
    const localFilePath = file.originalname;
    fs.writeFileSync(localFilePath, file.buffer);

    try {
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
      await client.disconnect();
      return result;
    } catch (error) {
      await client.disconnect();
      throw new HttpException(error.errorMessage, error.code || 500);
    }
  }
 */
