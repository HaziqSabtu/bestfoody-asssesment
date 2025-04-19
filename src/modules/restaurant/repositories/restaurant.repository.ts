import {
  Restaurant,
  RestaurantCategoryType,
} from '../entities/restaurant.entity';

export type createInput = {
  name: Restaurant['name'];
  category: Restaurant['category'];
  userId: Restaurant['userId'];
};

export type findAllInput = {
  category?: RestaurantCategoryType;
  name?: string;
  cursor?: string;
  take?: number;
};

export type updateInput = Partial<Pick<Restaurant, 'name' | 'category'>>;

export abstract class RestaurantRepository {
  abstract create(restaurant: createInput): Promise<Restaurant>;
  abstract findAll(findAllInput?: findAllInput): Promise<{
    restaurants: Restaurant[];
    nextCursor: string | null;
  }>;
  abstract findById(id: string): Promise<Restaurant | null>;
  abstract update(id: string, data: updateInput): Promise<Restaurant>;
  abstract delete(id: string): Promise<{ id: Restaurant['id'] }>;
}
