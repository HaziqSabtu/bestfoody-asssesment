import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { Restaurant } from '../entities/restaurant.entity';
import { RestaurantRepository } from '../repositories/restaurant.repository';

@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant =
      await this.restaurantRepository.create(createRestaurantDto);
    return restaurant;
  }

  async findById(id: string): Promise<Restaurant | null> {
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return restaurant;
  }

  async findAll(): Promise<Restaurant[]> {
    const restaurants = await this.restaurantRepository.findAll();
    return restaurants;
  }

  async update(id: string, data: UpdateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    const updatedRestaurant = await this.restaurantRepository.update(
      id,
      restaurant.update(data),
    );

    return updatedRestaurant;
  }

  async delete(id: string): Promise<string> {
    const deletedId = await this.restaurantRepository.delete(id);
    return deletedId;
  }
}
