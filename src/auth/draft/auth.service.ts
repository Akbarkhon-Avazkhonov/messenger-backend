import { Injectable } from '@nestjs/common';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
const apiId = 25660944;
const apiHash = '11cea33e2fe457036679c192bc4f2014';
@Injectable()
export class AuthService {
  stringSession = new StringSession('');
  // 2FA password should be turned off
  async signInWithPassword(phoneNumber: string, phoneCode?: string) {
    const client = new TelegramClient(this.stringSession, apiId, apiHash, {
      connectionRetries: 5,
      deviceModel: 'Phoenix',
      systemVersion: '2.0.1',
    });
    await client.connect();
    try {
      if (!(await client.checkAuthorization())) {
        await client.signInUser(
          { apiId: apiId, apiHash: apiHash },
          {
            phoneNumber: phoneNumber,
            phoneCode: async () => {
              // wait for the user to enter the code
              while (!phoneCode) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
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
      console.log('Error in password');
      console.log(e);
    }
  }

  qrToken: string;
  async signInWithQrCode() {
    const client = new TelegramClient(this.stringSession, apiId, apiHash, {});
    await client.connect();
    try {
      if (await client.checkAuthorization()) {
        const session = client.session.save();
        await client.disconnect();
        return { session: session };
      } else {
        client.signInUserWithQrCode(
          { apiId: apiId, apiHash: apiHash },
          {
            qrCode: async (code) => {
              this.qrToken = `tg://login?token=${code.token.toString(
                'base64url',
              )}`;
            },
            onError: async () => {
              return true;
            },
          },
        );
        while (!this.qrToken) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return { qrToken: this.qrToken };
      }
    } catch (e) {
      await client.disconnect();
      await client.destroy();
      console.log('Error in qr code');
      console.log(e);
    }
  }
}
