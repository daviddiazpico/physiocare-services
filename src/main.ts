import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as admin from 'firebase-admin';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const serviceAccount = require('../firebase/firebase_key.json');

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
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
