import { Injectable } from '@nestjs/common';
import {
  RestaurantRepository,
  createInput,
  updateInput,
  findAllInput,
} from './restaurant.repository';
import { PrismaService } from '../../shared/services/prisma.service';
import { Restaurant } from '../entities/restaurant.entity';
import { Rating } from '../entities/rating.entity';
import { Image } from '../entities/image.entity';
import { Prisma } from '@prisma/client';

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
    return new Restaurant({ ...created, rating, image: null });
  }

  async findById(id: string): Promise<Restaurant | null> {
    const data = await this.prisma.restaurant.findUnique({
      where: { id, deletedAt: null },
      include: {
        rating: true,
        image: true,
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

    const image = data.image
      ? new Image({
          imageId: data.image.id,
          url: data.image.url,
          uploadedAt: data.image.uploadedAt,
          userId: data.image.userId,
        })
      : null;

    return new Restaurant({
      ...data,
      rating,
      image,
    });
  }

  async findAll(params?: findAllInput): Promise<{
    restaurants: Restaurant[];
    nextCursor: string | null;
  }> {
    const { category, name, cursor, take = 10 } = params || {};

    const where: Prisma.RestaurantWhereInput = {
      deletedAt: null,
    };

    if (category) {
      where.category = category;
    }

    if (name) {
      where.name = {
        contains: name,
      };
    }

    const restaurants = await this.prisma.restaurant.findMany({
      where: where,
      include: {
        rating: true,
        image: true,
      },
      orderBy: {
        rating: {
          averageRating: 'desc',
        },
      },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take,
    });

    const mapped = restaurants.map((r) => {
      const rating = r.rating
        ? new Rating({
            rating: r.rating.averageRating,
            count: r.rating.reviewCount,
            lastUpdatedAt: r.rating.lastUpdated,
          })
        : new Rating({});

      const image = r.image
        ? new Image({
            imageId: r.image.id,
            url: r.image.url,
            uploadedAt: r.image.uploadedAt,
            userId: r.image.userId,
          })
        : null;

      return new Restaurant({ ...r, rating, image });
    });

    return {
      restaurants: mapped,
      nextCursor:
        restaurants.length === take
          ? restaurants[restaurants.length - 1].id
          : null,
    };
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
        image: true,
      },
    });

    const rating = updated.rating
      ? new Rating({
          rating: updated.rating.averageRating,
          count: updated.rating.reviewCount,
          lastUpdatedAt: updated.rating.lastUpdated,
        })
      : new Rating({});

    const image = updated.image
      ? new Image({
          imageId: updated.image.id,
          url: updated.image.url,
          uploadedAt: updated.image.uploadedAt,
          userId: updated.image.userId,
        })
      : null;
    return new Restaurant({ ...updated, rating, image: image });
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
