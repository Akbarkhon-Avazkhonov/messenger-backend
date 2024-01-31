import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Messanger API')
    .setVersion('0.0.1')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'session',
        in: 'header',
      },
      'session',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // awailable  cors
  await app.listen(3000);
}
bootstrap();
