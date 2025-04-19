import { z } from 'zod';
import { RestaurantCategoryEnum } from '../entities/restaurant.entity';
import { createZodDto } from 'nestjs-zod';

const createRestaurantSchema = z.object({
  name: z.string(),
  category: z.nativeEnum(RestaurantCategoryEnum),
});

export class CreateRestaurantDto extends createZodDto(createRestaurantSchema) {}
