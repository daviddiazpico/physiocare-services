import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class ImageService {
  saveImage(dir: string, image: string): Promise<string> {
    const data = image.split(',')[1] || image;
    const filePath = `images/${dir}/${Date.now()}.jpg`;
    return new Promise((resolve, reject) =>
      fs.writeFile(filePath, data, { encoding: 'base64' }, (error) => {
        if (error) {
          reject(error);
        }
        resolve(filePath);
      }),
    );
  }

  deleteImage(path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.unlink(path, (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }
}
