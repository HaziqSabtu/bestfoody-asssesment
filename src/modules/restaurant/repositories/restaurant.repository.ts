import { Restaurant } from '../entities/restaurant.entity';

export type createInput = {
  name: Restaurant['name'];
  category: Restaurant['category'];
};

export abstract class RestaurantRepository {
  abstract create(restaurant: createInput): Promise<Restaurant>;
  abstract findAll(): Promise<Restaurant[]>;
  abstract findById(id: string): Promise<Restaurant | null>;
  abstract update(id: string, data: Restaurant): Promise<Restaurant>;
  abstract delete(id: string): Promise<Restaurant['id']>;
}
