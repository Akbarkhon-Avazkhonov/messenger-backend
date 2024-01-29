import { TelegramClient } from 'telegram';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LogLevel } from 'telegram/extensions/Logger';
import { StringSession } from 'telegram/sessions';
const TEST_SERVERS = process.env.TEST_SERVERS == 'true';

export function telegramClient(
  session = '',
  apiId = process.env.API_ID,
  apiHash = process.env.API_HASH,
) {
  const client = new TelegramClient(
    new StringSession(session),
    +apiId,
    apiHash,
    {
      deviceModel: process.env.DEVICE_MODEL,
      systemVersion: process.env.SYSTEM_VERSION,
      appVersion: process.env.APP_VERSION,
      testServers: TEST_SERVERS,
    },
  );
  if (TEST_SERVERS) {
    client.session.setDC(
      +process.env.TEST_DC_ID,
      process.env.TEST_SERVER_ADDRESS,
      +process.env.TEST_SERVER_PORT,
    );
  }
  // client.setLogLevel(LogLevel.NONE);
  return client;
}
