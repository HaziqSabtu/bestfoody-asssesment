import { Injectable } from '@nestjs/common';
import { RatingRepository, createInput } from './rating.repository';
import { PrismaService } from '../../shared/services/prisma.service';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class RatingPrismaRepository implements RatingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(data: createInput): Promise<Rating> {
    const upserted = await this.prisma.restaurantRating.upsert({
      where: {
        restaurantId: data.restaurantId,
      },
      update: {
        averageRating: data.rating,
        reviewCount: data.count,
      },
      create: {
        restaurantId: data.restaurantId,
        averageRating: data.rating,
        reviewCount: data.count,
      },
    });

    return new Rating({
      ...upserted,
      rating: upserted.averageRating,
      count: upserted.reviewCount,
    });
  }
}
