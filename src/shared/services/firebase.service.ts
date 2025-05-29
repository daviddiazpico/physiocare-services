import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class FirebaseService {
  constructor() {}

  async sendMessage(token: string, title: string, body: string) {
    const message: Message = {
      notification: {
        title: title,
        body: body,
      },
      token: token,
    };

    try {
      const response = await admin.messaging().send(message);
      return response;
    } catch {
      return null;
    }
  }
}
