import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { telegramClient } from 'src/telegramClient';

import { Api } from 'telegram';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async sendCode(phoneNumber: string) {
    const client = telegramClient();
    await client.connect();
    try {
      const { phoneCodeHash } = await client.sendCode(
        {
          apiId: +process.env.API_ID,
          apiHash: process.env.API_HASH,
        },
        phoneNumber,
      );
      const session = client.session.save();
      console.log(phoneCodeHash);
      await client.disconnect();
      return { phoneCodeHash: phoneCodeHash, session: session };
    } catch (e) {
      throw new HttpException('PHONE_NUMBER_INVALID', HttpStatus.BAD_REQUEST);
    }
  }
  async signInWithCode(
    phoneNumber: string,
    phoneCodeHash: string,
    phoneCode: string,
    session: string,
  ) {
    const client = telegramClient(session);
    await client.connect();
    try {
      await client.invoke(
        new Api.auth.SignIn({
          phoneNumber: phoneNumber,
          phoneCodeHash: phoneCodeHash,
          phoneCode: phoneCode,
        }),
      );
      if (client.isUserAuthorized()) {
        const session = client.session.save();
        await client.disconnect();
        return { session: session };
      } else {
        throw new HttpException('PHONE_CODE_INVALID', HttpStatus.BAD_REQUEST);
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_GATEWAY);
    }
  }
  async checkUsername(headers: any, username: string) {
    const client = telegramClient(headers.session);
    await client.connect();
    try {
      const result = await client.invoke(
        new Api.account.CheckUsername({ username }),
      );
      return result;
    } catch {
      return false;
    }
  }
  async signInWithName(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
        password: password,
      },
    });
    if (user) {
      return user;
    } else {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
