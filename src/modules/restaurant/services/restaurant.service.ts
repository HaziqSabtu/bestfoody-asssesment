import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { Restaurant } from '../entities/restaurant.entity';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import { AuthUser } from 'src/common/interfaces/auth.interface';

@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async create(
    createRestaurantDto: CreateRestaurantDto,
    user: AuthUser,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.create({
      ...createRestaurantDto,
      userId: user.userId,
    });
    return restaurant;
  }

  async findById(id: string): Promise<Restaurant | null> {
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return restaurant;
  }

  async findAll(): Promise<{ restaurants: Restaurant[] }> {
    const restaurants = await this.restaurantRepository.findAll();
    return { restaurants };
  }

  async update(
    id: string,
    data: UpdateRestaurantDto,
    user: AuthUser,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    if (restaurant.userId !== user.userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this restaurant',
      );
    }

    const updatedRestaurant = await this.restaurantRepository.update(
      id,
      restaurant.update(data),
    );

    return updatedRestaurant;
  }

  async delete(id: string, user: AuthUser): Promise<{ id: Restaurant['id'] }> {
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    if (restaurant.userId !== user.userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this restaurant',
      );
    }

    const deletedId = await this.restaurantRepository.delete(id);
    return deletedId;
  }
}
