import { z } from 'zod';
import { RestaurantCategoryEnum } from '../entities/restaurant.entity';

export const createRestaurantSchema = z.object({
  name: z.string(),
  category: z.nativeEnum(RestaurantCategoryEnum),
});

export type CreateRestaurantDto = z.infer<typeof createRestaurantSchema>;
