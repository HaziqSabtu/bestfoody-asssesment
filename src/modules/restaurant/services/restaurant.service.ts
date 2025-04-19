import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
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

  async findAll(): Promise<Restaurant[]> {
    const restaurants = await this.restaurantRepository.findAll();
    return restaurants;
  }
}
