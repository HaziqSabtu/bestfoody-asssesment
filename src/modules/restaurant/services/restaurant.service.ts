import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { FindAllRestaurantDto } from '../dtos/find-restaurant.dto';
import { Restaurant } from '../entities/restaurant.entity';
import { RestaurantRepository } from '../repositories/restaurant.repository';

interface CreateInput extends CreateRestaurantDto {
  userId: string;
}

interface UpdateInput extends UpdateRestaurantDto {
  userId: string;
  restaurantId: string;
}

interface DeleteInput {
  userId: string;
  restaurantId: string;
}

@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async create(data: CreateInput): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.create(data);
    return restaurant;
  }

  async findById(id: string): Promise<Restaurant | null> {
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return restaurant;
  }

  async findAll(findAllInput: FindAllRestaurantDto): Promise<{
    restaurants: Restaurant[];
    nextCursor: string | null;
  }> {
    const { category, name, cursor, take } = findAllInput;
    const restaurants = await this.restaurantRepository.findAll({
      category,
      name,
      cursor,
      take,
    });
    return restaurants;
  }

  async update(data: UpdateInput): Promise<Restaurant> {
    const { restaurantId } = data;
    const restaurant = await this.restaurantRepository.findById(restaurantId);

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${restaurantId} not found`,
      );
    }

    if (restaurant.userId !== data.userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this restaurant',
      );
    }

    const updatedRestaurant = await this.restaurantRepository.update(
      restaurantId,
      data,
    );

    return updatedRestaurant;
  }

  async delete(data: DeleteInput): Promise<{ id: Restaurant['id'] }> {
    const { restaurantId } = data;
    const restaurant = await this.restaurantRepository.findById(restaurantId);

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${restaurantId} not found`,
      );
    }

    if (restaurant.userId !== data.userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this restaurant',
      );
    }

    const deletedId = await this.restaurantRepository.delete(restaurantId);
    return deletedId;
  }
}
