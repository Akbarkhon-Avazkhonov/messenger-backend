import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { telegramClient } from 'src/telegramClient';

import { Api } from 'telegram';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // function to create random token
  async createToken() {
    const token = Math.random().toString(36).substr(2, 9);
    return token;
  }

  async createAdmin(name: string, password: string) {
    const admin = await this.prisma.user.create({
      data: {
        name: name,
        password: password,
        role_id: 1,
        session: await this.createToken(),
      },
    });
    return { session: admin.session };
  }

  async sendCode(name: string, password: string, phoneNumber: string) {
    const client = telegramClient();
    await client.connect();
    if (
      await this.prisma.user.findFirst({ where: { phoneNumber: phoneNumber } })
    ) {
      throw new HttpException(
        'PHONE_NUMBER_ALREADY_EXISTS',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const { phoneCodeHash } = await client.sendCode(
        {
          apiId: +process.env.API_ID,
          apiHash: process.env.API_HASH,
        },
        phoneNumber,
      );
      const session = client.session.save();
      await this.prisma.user.create({
        data: {
          name: name,
          password: password,
          phoneNumber: phoneNumber,
        },
      });
      await client.disconnect();
      return { phoneCodeHash: phoneCodeHash, session: session };
    } catch (e) {
      throw new HttpException(e.messages, HttpStatus.BAD_REQUEST);
    }
  }
  async signInWithCode(
    phoneNumber: string,
    phoneCodeHash: string,
    phoneCode: string,
    session: string,
  ) {
    const oldSession = session;
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
      await this.prisma.user.update({
        where: {
          phoneNumber: phoneNumber,
        },
        data: {
          session: oldSession,
        },
      });
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
  async signInWithName(name: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        name: name,
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
