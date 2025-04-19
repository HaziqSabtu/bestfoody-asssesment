import { z } from 'zod';
import { RestaurantCategoryEnum } from '../entities/restaurant.entity';
import { createZodDto } from 'nestjs-zod';

const findAllRestaurantSchema = z.object({
  category: z.nativeEnum(RestaurantCategoryEnum).optional(),
  name: z.string().optional(),
  cursor: z.string().optional(),
  take: z.number().optional(),
});

export class FindAllRestaurantDto extends createZodDto(
  findAllRestaurantSchema,
) {}
