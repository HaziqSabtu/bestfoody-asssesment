import { z } from 'zod';
import { RestaurantCategoryEnum } from '../entities/restaurant.entity';

export const updateRestaurantSchema = z
  .object({
    name: z.string().optional(),
    category: z.nativeEnum(RestaurantCategoryEnum).optional(),
  })
  .refine((data) => data.name || data.category, {
    message: 'Either name or category must be provided',
  });

export type UpdateRestaurantDto = z.infer<typeof updateRestaurantSchema>;
