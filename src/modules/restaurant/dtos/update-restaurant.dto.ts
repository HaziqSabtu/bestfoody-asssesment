import { z } from 'zod';
import { RestaurantCategoryEnum } from '../entities/restaurant.entity';
import { createZodDto } from 'nestjs-zod';

const updateRestaurantSchema = z
  .object({
    name: z.string().optional(),
    category: z.nativeEnum(RestaurantCategoryEnum).optional(),
  })
  .refine((data) => data.name || data.category, {
    message: 'Either name or category must be provided',
  });

export class UpdateRestaurantDto extends createZodDto(updateRestaurantSchema) {}
