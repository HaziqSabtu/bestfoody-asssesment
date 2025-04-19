/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudService {
  async upload(file: Express.Multer.File): Promise<{ url: string }> {
    // TODO: upload to cloud storage
    const currentTime = new Date().getTime();

    //sleep for 50ms
    await new Promise((resolve) => setTimeout(resolve, 50));

    return {
      url: `https://cdn.example.com/${currentTime}.jpg`,
    };
  }
}
