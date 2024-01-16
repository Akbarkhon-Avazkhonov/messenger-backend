import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { TelegramClient } from 'telegram';
import { PromisedNetSockets } from 'telegram/extensions';
import { StringSession } from 'telegram/sessions';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  stringSession = new StringSession('');
  // 2FA password should be turned off
  async signInWithPassword(phoneNumber: string, phoneCode?: string) {
    const client = new TelegramClient(
      this.stringSession,
      +process.env.API_ID,
      process.env.API_HASH,
      {
        deviceModel: process.env.DEVICE_MODEL,
        systemVersion: process.env.SYSTEM_VERSION,
        appVersion: process.env.APP_VERSION,
        networkSocket: PromisedNetSockets,
      },
    );
    await client.connect();
    try {
      if (!(await client.checkAuthorization())) {
        await client.signInUser(
          { apiId: +process.env.API_ID, apiHash: process.env.API_HASH },
          {
            phoneNumber: phoneNumber,
            phoneCode: async () => {
              // wait for the user to enter the code
              while (!phoneCode) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                throw new Error('EMPTY_PHONE_CODE');
              }
              return phoneCode;
            },
            onError: async function () {
              return true;
            },
          },
        );
        const session = client.session.save();
        await client.disconnect();
        await client.destroy();
        return { session: session };
      }
    } catch (e) {
      await client.disconnect();
      await client.destroy();
      console.log(e);
      throw new HttpException('EMPTY_PHONE_CODE', HttpStatus.ACCEPTED);
    }
  }
}
