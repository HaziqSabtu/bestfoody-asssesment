/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RatingService } from './rating.service';
import { RatingRepository } from '../repositories/rating.repository';
import { ReviewRepository } from '../repositories/review.repository';
import { Rating } from '../entities/rating.entity';
import { Review } from '../entities/review.entity';

describe('RatingService', () => {
  let service: RatingService;
  let ratingRepository: jest.Mocked<RatingRepository>;
  let reviewRepository: jest.Mocked<ReviewRepository>;

  const mockRatingRepository = () => ({
    upsert: jest.fn(),
  });

  const mockReviewRepository = () => ({
    findAllByRestaurantId: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        {
          provide: RatingRepository,
          useFactory: mockRatingRepository,
        },
        {
          provide: ReviewRepository,
          useFactory: mockReviewRepository,
        },
      ],
    }).compile();

    service = module.get<RatingService>(RatingService);
    ratingRepository = module.get(RatingRepository);
    reviewRepository = module.get(ReviewRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('computeRating', () => {
    const restaurantId = 'restaurant-123';

    it('should compute rating with multiple reviews', async () => {
      // Mock reviews for the restaurant
      const mockReviews: Partial<Review>[] = [
        { id: 'review-1', rating: 4, restaurantId },
        { id: 'review-2', rating: 5, restaurantId },
        { id: 'review-3', rating: 3, restaurantId },
      ];

      const expectedRating = 12;
      const expectedCount = 3;

      reviewRepository.findAllByRestaurantId.mockResolvedValue(
        mockReviews as Review[],
      );

      const mockRatingResult: Rating = {
        rating: expectedRating,
        count: expectedCount,
        lastUpdatedAt: new Date(),
      };

      ratingRepository.upsert.mockResolvedValue(mockRatingResult);

      const result = await service.computeRating(restaurantId);

      expect(reviewRepository.findAllByRestaurantId).toHaveBeenCalledWith(
        restaurantId,
      );
      expect(ratingRepository.upsert).toHaveBeenCalledWith({
        restaurantId,
        rating: expectedRating,
        count: expectedCount,
      });

      expect(result).toEqual(mockRatingResult);
    });

    it('should compute rating with a single review', async () => {
      const mockReviews: Partial<Review>[] = [
        { id: 'review-1', rating: 5, restaurantId },
      ];

      const expectedRating = 5;
      const expectedCount = 1;

      reviewRepository.findAllByRestaurantId.mockResolvedValue(
        mockReviews as Review[],
      );

      const mockRatingResult: Rating = {
        rating: expectedRating,
        count: expectedCount,
        lastUpdatedAt: new Date(),
      };

      ratingRepository.upsert.mockResolvedValue(mockRatingResult);

      const result = await service.computeRating(restaurantId);

      expect(reviewRepository.findAllByRestaurantId).toHaveBeenCalledWith(
        restaurantId,
      );
      expect(ratingRepository.upsert).toHaveBeenCalledWith({
        restaurantId,
        rating: expectedRating,
        count: expectedCount,
      });

      expect(result).toEqual(mockRatingResult);
    });

    it('should handle restaurant with no reviews', async () => {
      const mockReviews: Review[] = [];

      const expectedRating = 0;
      const expectedCount = 0;

      reviewRepository.findAllByRestaurantId.mockResolvedValue(mockReviews);

      const mockRatingResult: Rating = {
        rating: expectedRating,
        count: expectedCount,
        lastUpdatedAt: new Date(),
      };

      ratingRepository.upsert.mockResolvedValue(mockRatingResult);

      const result = await service.computeRating(restaurantId);

      expect(reviewRepository.findAllByRestaurantId).toHaveBeenCalledWith(
        restaurantId,
      );
      expect(ratingRepository.upsert).toHaveBeenCalledWith({
        restaurantId,
        rating: expectedRating,
        count: expectedCount,
      });

      expect(result).toEqual(mockRatingResult);
    });

    it('should handle reviews with zero ratings', async () => {
      const mockReviews: Partial<Review>[] = [
        { id: 'review-1', rating: 0, restaurantId },
        { id: 'review-2', rating: 0, restaurantId },
      ];

      const expectedRating = 0;
      const expectedCount = 2;

      reviewRepository.findAllByRestaurantId.mockResolvedValue(
        mockReviews as Review[],
      );

      const mockRatingResult: Rating = {
        rating: expectedRating,
        count: expectedCount,
        lastUpdatedAt: new Date(),
      };

      ratingRepository.upsert.mockResolvedValue(mockRatingResult);

      const result = await service.computeRating(restaurantId);

      expect(reviewRepository.findAllByRestaurantId).toHaveBeenCalledWith(
        restaurantId,
      );
      expect(ratingRepository.upsert).toHaveBeenCalledWith({
        restaurantId,
        rating: expectedRating,
        count: expectedCount,
      });

      expect(result).toEqual(mockRatingResult);
    });

    it('should handle mixed review ratings', async () => {
      const mockReviews: Partial<Review>[] = [
        { id: 'review-1', rating: 0, restaurantId },
        { id: 'review-2', rating: 5, restaurantId },
        { id: 'review-3', rating: 3, restaurantId },
        { id: 'review-4', rating: 0, restaurantId },
      ];

      const expectedRating = 8;
      const expectedCount = 4;

      reviewRepository.findAllByRestaurantId.mockResolvedValue(
        mockReviews as Review[],
      );

      const mockRatingResult: Rating = {
        rating: expectedRating,
        count: expectedCount,
        lastUpdatedAt: new Date(),
      };

      ratingRepository.upsert.mockResolvedValue(mockRatingResult);

      const result = await service.computeRating(restaurantId);

      expect(reviewRepository.findAllByRestaurantId).toHaveBeenCalledWith(
        restaurantId,
      );
      expect(ratingRepository.upsert).toHaveBeenCalledWith({
        restaurantId,
        rating: expectedRating,
        count: expectedCount,
      });

      expect(result).toEqual(mockRatingResult);
    });
  });
});
