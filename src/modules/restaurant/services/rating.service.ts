import { Injectable } from '@nestjs/common';
import { Rating } from '../entities/rating.entity';
import { RatingRepository } from '../repositories/rating.repository';
import { ReviewRepository } from '../repositories/review.repository';

@Injectable()
export class RatingService {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  // This is not the best way to compute rating, but it's fine for now
  // TODO: Do Event driven architecture
  async computeRating(restaurantId: string): Promise<Rating> {
    const reviews =
      await this.reviewRepository.findAllByRestaurantId(restaurantId);

    const averageRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );

    const reviewCount = reviews.length;

    const ratingData = await this.ratingRepository.upsert({
      restaurantId,
      rating: averageRating,
      count: reviewCount,
    });
    return ratingData;
  }
}
