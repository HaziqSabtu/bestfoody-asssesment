import { Injectable } from '@nestjs/common';
import { ImageRepository, createInput } from './image.repository';
import { PrismaService } from '../../shared/services/prisma.service';
import { Image } from '../entities/image.entity';

@Injectable()
export class ImagePrismaRepository implements ImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: createInput): Promise<Image> {
    const created = await this.prisma.restaurantImage.create({
      data: {
        url: data.url,
        userId: data.userId,
      },
    });

    return new Image({
      ...created,
      imageId: created.id,
    });
  }

  async findByIdAndUserId(
    imageId: string,
    userId: string,
  ): Promise<Image | null> {
    const data = await this.prisma.restaurantImage.findUnique({
      where: { id: imageId, userId },
    });

    if (!data) {
      return null;
    }

    return new Image({
      ...data,
      imageId: data.id,
    });
  }
}
