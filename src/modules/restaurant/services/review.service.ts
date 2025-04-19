import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { UpdateReviewDto } from '../dtos/update-review.dto';
import { Review } from '../entities/review.entity';
import { ReviewRepository } from '../repositories/review.repository';
import { RestaurantRepository } from '../repositories/restaurant.repository';

import { UserAlreadyReviewedException } from '../../../common/exceptions/user-reviewed.exception';
import { RatingService } from './rating.service';

interface CreateInput extends CreateReviewDto {
  userId: string;
  restaurantId: string;
}

interface UpdateInput extends UpdateReviewDto {
  userId: string;
  restaurantId: string;
  reviewId: string;
}

interface DeleteInput {
  userId: string;
  restaurantId: string;
  reviewId: string;
}

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly restaurantRepository: RestaurantRepository,
    private readonly ratingService: RatingService,
  ) {}

  async create(createInput: CreateInput): Promise<Review> {
    const restaurant = await this.restaurantRepository.findById(
      createInput.restaurantId,
    );

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${createInput.restaurantId} not found`,
      );
    }

    const isUserReviewed =
      await this.reviewRepository.findOneByUserIdAndRestaurantId(
        createInput.userId,
        createInput.restaurantId,
      );

    if (isUserReviewed) {
      throw new UserAlreadyReviewedException();
    }

    const review = await this.reviewRepository.create(createInput);

    await this.ratingService.computeRating(createInput.restaurantId);

    return review;
  }

  async findAllByRestaurantId(
    restaurantId: string,
  ): Promise<{ reviews: Review[] }> {
    const restaurant = await this.restaurantRepository.findById(restaurantId);

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${restaurantId} not found`,
      );
    }

    const reviews =
      await this.reviewRepository.findAllByRestaurantId(restaurantId);
    return { reviews };
  }

  async update(data: UpdateInput): Promise<Review> {
    const { reviewId, restaurantId, userId } = data;
    const review = await this.reviewRepository.findById(reviewId);

    if (!review || review.restaurantId !== restaurantId) {
      throw new NotFoundException(`Review with id ${reviewId} not found`);
    }

    if (review.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this review',
      );
    }

    const updatedReview = await this.reviewRepository.update(reviewId, data);

    await this.ratingService.computeRating(restaurantId);

    return updatedReview;
  }

  async delete(data: DeleteInput): Promise<{ id: Review['id'] }> {
    const { reviewId, restaurantId, userId } = data;
    const review = await this.reviewRepository.findById(reviewId);

    if (!review || review.restaurantId !== restaurantId) {
      throw new NotFoundException(`Review with id ${reviewId} not found`);
    }

    if (review.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this review',
      );
    }

    const deletedId = await this.reviewRepository.delete(reviewId);

    await this.ratingService.computeRating(restaurantId);

    return deletedId;
  }
}
