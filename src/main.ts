import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cors({
      origin: '*',
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '25mb' }));
  app.use('/images', express.static(__dirname + '/../images'));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
