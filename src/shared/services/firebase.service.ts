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
      console.log("Se ha enviado");
      return response;
    } catch (e) {
      console.log("Ha petado al enviar");
      console.log(e);
      console.log(e.message);
      return null;
    }
  }
}
