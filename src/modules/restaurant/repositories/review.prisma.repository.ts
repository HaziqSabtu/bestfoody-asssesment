import { Injectable } from '@nestjs/common';
import {
  ReviewRepository,
  createInput,
  updateInput,
} from './review.repository';
import { PrismaService } from '../../shared/services/prisma.service';
import { Review } from '../entities/review.entity';

@Injectable()
export class ReviewPrismaRepository implements ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(review: createInput): Promise<Review> {
    const created = await this.prisma.review.create({
      data: {
        reviewText: review.reviewText,
        rating: review.rating,
        userId: review.userId,
        restaurantId: review.restaurantId,
      },
    });
    return new Review(created);
  }

  async findById(id: string): Promise<Review | null> {
    const data = await this.prisma.review.findUnique({
      where: { id, deletedAt: null },
    });

    if (!data) {
      return null;
    }

    return new Review(data);
  }

  async findOneByUserIdAndRestaurantId(
    userId: string,
    restaurantId: string,
  ): Promise<Review | null> {
    const data = await this.prisma.review.findFirst({
      where: {
        userId,
        restaurantId,
        deletedAt: null,
      },
    });

    return data ? new Review(data) : null;
  }

  async findAllByRestaurantId(restaurantId: string): Promise<Review[]> {
    const data = await this.prisma.review.findMany({
      where: {
        restaurantId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((d) => new Review(d));
  }

  async update(id: string, data: updateInput): Promise<Review> {
    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        reviewText: data.reviewText,
        rating: data.rating,
      },
    });
    return new Review(updated);
  }

  async delete(id: string): Promise<{ id: Review['id'] }> {
    const currentTime = new Date();
    const deleted = await this.prisma.review.update({
      where: { id },
      data: {
        deletedAt: currentTime,
      },
    });

    return {
      id: deleted.id,
    };
  }
}
