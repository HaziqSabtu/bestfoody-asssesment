import { Restaurant } from '../entities/restaurant.entity';

export type createInput = {
  name: Restaurant['name'];
  category: Restaurant['category'];
  userId: Restaurant['userId'];
};

export type updateInput = Partial<Pick<Restaurant, 'name' | 'category'>>;

export abstract class RestaurantRepository {
  abstract create(restaurant: createInput): Promise<Restaurant>;
  abstract findAll(): Promise<Restaurant[]>;
  abstract findById(id: string): Promise<Restaurant | null>;
  abstract update(id: string, data: updateInput): Promise<Restaurant>;
  abstract delete(id: string): Promise<{ id: Restaurant['id'] }>;
}
