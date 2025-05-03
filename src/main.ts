import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json({ limit: "25mb" }))
  app.use('/images', express.static(__dirname + '/../images'));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
