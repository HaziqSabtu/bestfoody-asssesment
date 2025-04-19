import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const createReviewSchema = z.object({
  rating: z.number().min(1).max(5).int(),
  reviewText: z
    .string()
    .optional()
    .transform((v) => v ?? null),
});

export class CreateReviewDto extends createZodDto(createReviewSchema) {}
