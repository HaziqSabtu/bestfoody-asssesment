import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const updateReviewSchema = z
  .object({
    rating: z.number().min(1).max(5).int().optional(),
    reviewText: z.string().optional(),
  })
  .refine((data) => data.rating || data.reviewText, {
    message: 'Either rating or reviewText must be provided',
  });

export class UpdateReviewDto extends createZodDto(updateReviewSchema) {}
