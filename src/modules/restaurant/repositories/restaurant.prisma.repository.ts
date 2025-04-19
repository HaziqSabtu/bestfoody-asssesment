import { Injectable } from '@nestjs/common';
import {
  RestaurantRepository,
  createInput,
  updateInput,
} from './restaurant.repository';
import { PrismaService } from '../../shared/services/prisma.service';
import { Restaurant } from '../entities/restaurant.entity';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class RestaurantPrismaRepository implements RestaurantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(restaurant: createInput): Promise<Restaurant> {
    const created = await this.prisma.restaurant.create({
      data: {
        name: restaurant.name,
        category: restaurant.category,
        userId: restaurant.userId,
      },
    });
    const rating = new Rating({});
    return new Restaurant({ ...created, rating });
  }

  async findById(id: string): Promise<Restaurant | null> {
    const data = await this.prisma.restaurant.findUnique({
      where: { id, deletedAt: null },
      include: {
        rating: true,
      },
    });

    if (!data) {
      return null;
    }

    const rating = data.rating
      ? new Rating({
          rating: data.rating.averageRating,
          count: data.rating.reviewCount,
          lastUpdatedAt: data.rating.lastUpdated,
        })
      : new Rating({});

    return new Restaurant({
      ...data,
      rating,
    });
  }

  async findAll(): Promise<Restaurant[]> {
    const Restaurants = await this.prisma.restaurant.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        rating: true,
      },
    });
    return Restaurants.map((r) => {
      if (r.rating) {
        const rating = new Rating({
          rating: r.rating.averageRating,
          count: r.rating.reviewCount,
          lastUpdatedAt: r.rating.lastUpdated,
        });
        return new Restaurant({ ...r, rating });
      }
      return new Restaurant({ ...r, rating: new Rating({}) });
    });
  }

  async update(id: string, data: updateInput): Promise<Restaurant> {
    const updated = await this.prisma.restaurant.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
      },
      include: {
        rating: true,
      },
    });

    const rating = updated.rating
      ? new Rating({
          rating: updated.rating.averageRating,
          count: updated.rating.reviewCount,
          lastUpdatedAt: updated.rating.lastUpdated,
        })
      : new Rating({});
    return new Restaurant({ ...updated, rating });
  }

  async delete(id: string): Promise<{ id: Restaurant['id'] }> {
    const currentTime = new Date();
    const deleted = await this.prisma.restaurant.update({
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
