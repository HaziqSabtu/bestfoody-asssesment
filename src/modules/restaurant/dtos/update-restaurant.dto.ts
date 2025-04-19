import { z } from 'zod';
import { RestaurantCategoryEnum } from '../entities/restaurant.entity';
import { createZodDto } from 'nestjs-zod';

const updateRestaurantSchema = z
  .object({
    name: z.string().optional(),
    category: z.nativeEnum(RestaurantCategoryEnum).optional(),
    imageId: z.string().optional(),
  })
  .refine((data) => data.name || data.category || data.imageId, {
    message: 'Either name, category or imageId must be provided',
    path: ['name', 'category', 'imageId'],
  });

export class UpdateRestaurantDto extends createZodDto(updateRestaurantSchema) {}
