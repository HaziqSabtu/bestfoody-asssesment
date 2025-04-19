import { Injectable } from '@nestjs/common';
import { Image } from '../entities/image.entity';
import { ImageRepository } from '../repositories/image.repository';
import { CloudService } from 'src/modules/shared/services/cloud.service';
import { AuthUser } from 'src/common/interfaces/auth.interface';

@Injectable()
export class ImageService {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly cloudService: CloudService,
  ) {}

  async upload(data: Express.Multer.File, user: AuthUser): Promise<Image> {
    const { url } = await this.cloudService.upload(data);

    const Image = await this.imageRepository.create({
      url,
      userId: user.userId,
    });
    return Image;
  }
}
