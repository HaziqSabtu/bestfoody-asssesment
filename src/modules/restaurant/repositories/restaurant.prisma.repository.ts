import { Injectable } from '@nestjs/common';
import { RestaurantRepository, createInput } from './restaurant.repository';
import { PrismaService } from '../../shared/services/prisma.service';
import { Restaurant } from '../entities/restaurant.entity';

@Injectable()
export class RestaurantPrismaRepository implements RestaurantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(restaurant: createInput): Promise<Restaurant> {
    const created = await this.prisma.restaurant.create({ data: restaurant });
    return new Restaurant(created);
  }

  //   async findById(id: string): Promise<Restaurant | null> {
  //     const Restaurant = await this.prisma.restaurant.findUnique({
  //       where: { id },
  //     });
  //     return Restaurant ? new Restaurant(Restaurant) : null;
  //   }

  async findAll(): Promise<Restaurant[]> {
    const Restaurants = await this.prisma.restaurant.findMany();
    return Restaurants.map((r) => new Restaurant(r));
  }

  //   async update(id: string, data: UpdateRestaurantInput): Promise<Restaurant> {
  //     const updated = await this.prisma.restaurant.update({
  //       where: { id },
  //       data,
  //     });
  //     return new Restaurant(updated); // Map to domain entity
  //   }

  //   async delete(id: string): Promise<string> {
  //     const deleted = await this.prisma.restaurant.delete({
  //       where: { id },
  //     });
  //     return deleted.id;
  //   }
}
