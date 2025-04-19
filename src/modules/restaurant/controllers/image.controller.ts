import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from '../services/image.service';
import { Image } from '../entities/image.entity';
import status from 'http-status';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { AuthUser } from 'src/common/interfaces/auth.interface';
import { User } from 'src/common/decorators/user.decorator';

@Controller('restaurants/upload-image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @HttpCode(status.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async upload(
    @User() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Image> {
    return await this.imageService.upload(file, user);
  }
}
