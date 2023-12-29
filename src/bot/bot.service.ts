import { Injectable } from '@nestjs/common';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
const stringSession = new StringSession('');
@Injectable()
export class BotService {
  private qrCode: string;
  private session: string;
  private user: any;
  async signInWithQrCode(oldToken: string) {
    if (this.session || oldToken == this.session) {
      return { session: this.session };
    } else if (oldToken == this.qrCode && this.qrCode) {
      console.log('here');
      return { token: this.qrCode };
    } else {
      const apiId = 25660944;
      const apiHash = '11cea33e2fe457036679c192bc4f2014';
      const client = new TelegramClient(stringSession, apiId, apiHash, {});
      await client.connect();
      try {
        this.user = client.signInUserWithQrCode(
          { apiId: apiId, apiHash: apiHash },
          {
            qrCode: async (code) => {
              this.qrCode = `tg://login?token=${code.token.toString(
                'base64url',
              )}`;
            },
            onError: async function (e) {
              console.log(e.message);
              return false;
            },
            password: async () => {
              return '1111';
            },
          },
        );
      } catch (e) {
        console.log(e);
      }
      client.session.save();
      while (!this.qrCode) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return { token: this.qrCode };
    }
  }
}
