/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { ReviewRepository } from '../repositories/review.repository';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import { RatingService } from './rating.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserAlreadyReviewedException } from '../../../common/exceptions/user-reviewed.exception';
import { Review } from '../entities/review.entity';
import {
  Restaurant,
  RestaurantCategoryEnum,
} from '../entities/restaurant.entity';

describe('ReviewService', () => {
  let service: ReviewService;
  let reviewRepository: jest.Mocked<ReviewRepository>;
  let restaurantRepository: jest.Mocked<RestaurantRepository>;
  let ratingService: jest.Mocked<RatingService>;

  const mockReviewRepository = () => ({
    create: jest.fn(),
    findById: jest.fn(),
    findAllByRestaurantId: jest.fn(),
    findOneByUserIdAndRestaurantId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  const mockRestaurantRepository = () => ({
    findById: jest.fn(),
  });

  const mockRatingService = () => ({
    computeRating: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: ReviewRepository,
          useFactory: mockReviewRepository,
        },
        {
          provide: RestaurantRepository,
          useFactory: mockRestaurantRepository,
        },
        {
          provide: RatingService,
          useFactory: mockRatingService,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get(ReviewRepository);
    restaurantRepository = module.get(RestaurantRepository);
    ratingService = module.get(RatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createInput = {
      userId: 'user-123',
      restaurantId: 'restaurant-123',
      rating: 4,
      reviewText: 'Great restaurant!',
    };

    const mockRestaurant: Restaurant = {
      id: 'restaurant-123',
      name: 'Test Restaurant',
      category: RestaurantCategoryEnum.MALAYSIAN,
      userId: 'owner-123',
      image: null,
      rating: {
        rating: 4.5,
        count: 10,
        lastUpdatedAt: new Date(),
      },
    };

    const mockReview: Review = {
      id: 'review-123',
      userId: 'user-123',
      restaurantId: 'restaurant-123',
      rating: 4,
      reviewText: 'Great restaurant!',
      createdAt: new Date(),
    };

    it('should create a review successfully', async () => {
      restaurantRepository.findById.mockResolvedValue(mockRestaurant);
      reviewRepository.findOneByUserIdAndRestaurantId.mockResolvedValue(null);
      reviewRepository.create.mockResolvedValue(mockReview);
      ratingService.computeRating.mockResolvedValue({
        rating: mockReview.rating,
        count: 1,
        lastUpdatedAt: new Date(),
      });

      const result = await service.create(createInput);

      expect(restaurantRepository.findById).toHaveBeenCalledWith(
        createInput.restaurantId,
      );
      expect(
        reviewRepository.findOneByUserIdAndRestaurantId,
      ).toHaveBeenCalledWith(createInput.userId, createInput.restaurantId);
      expect(reviewRepository.create).toHaveBeenCalledWith(createInput);
      expect(ratingService.computeRating).toHaveBeenCalledWith(
        createInput.restaurantId,
      );
      expect(result).toEqual(mockReview);
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      restaurantRepository.findById.mockResolvedValue(null);

      await expect(service.create(createInput)).rejects.toThrow(
        new NotFoundException(
          `Restaurant with id ${createInput.restaurantId} not found`,
        ),
      );
      expect(reviewRepository.create).not.toHaveBeenCalled();
      expect(ratingService.computeRating).not.toHaveBeenCalled();
    });

    it('should throw UserAlreadyReviewedException if user already reviewed', async () => {
      restaurantRepository.findById.mockResolvedValue(mockRestaurant);
      reviewRepository.findOneByUserIdAndRestaurantId.mockResolvedValue(
        mockReview,
      );

      await expect(service.create(createInput)).rejects.toThrow(
        UserAlreadyReviewedException,
      );
      expect(reviewRepository.create).not.toHaveBeenCalled();
      expect(ratingService.computeRating).not.toHaveBeenCalled();
    });
  });

  describe('findAllByRestaurantId', () => {
    const restaurantId = 'restaurant-123';

    const mockRestaurant: Restaurant = {
      id: restaurantId,
      name: 'Test Restaurant',
      category: RestaurantCategoryEnum.MALAYSIAN,
      userId: 'owner-123',
      image: null,
      rating: {
        rating: 4.5,
        count: 10,
        lastUpdatedAt: new Date(),
      },
    };

    const mockReviews: Review[] = [
      {
        id: 'review-1',
        userId: 'user-1',
        restaurantId,
        rating: 4,
        reviewText: 'Great food!',
        createdAt: new Date(),
      },
      {
        id: 'review-2',
        userId: 'user-2',
        restaurantId,
        rating: 5,
        reviewText: 'Amazing service!',
        createdAt: new Date(),
      },
    ];

    it('should find all reviews for a restaurant', async () => {
      restaurantRepository.findById.mockResolvedValue(mockRestaurant);
      reviewRepository.findAllByRestaurantId.mockResolvedValue(mockReviews);

      const result = await service.findAllByRestaurantId(restaurantId);

      expect(restaurantRepository.findById).toHaveBeenCalledWith(restaurantId);
      expect(reviewRepository.findAllByRestaurantId).toHaveBeenCalledWith(
        restaurantId,
      );
      expect(result).toEqual({ reviews: mockReviews });
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      restaurantRepository.findById.mockResolvedValue(null);

      await expect(service.findAllByRestaurantId(restaurantId)).rejects.toThrow(
        new NotFoundException(`Restaurant with id ${restaurantId} not found`),
      );
      expect(reviewRepository.findAllByRestaurantId).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateInput = {
      userId: 'user-123',
      restaurantId: 'restaurant-123',
      reviewId: 'review-123',
      rating: 5,
      reviewText: 'Updated: Even better than before!',
    };

    const existingReview: Review = {
      id: 'review-123',
      userId: 'user-123',
      restaurantId: 'restaurant-123',
      rating: 4,
      reviewText: 'Great restaurant!',
      createdAt: new Date(),
    };

    const updatedReview: Review = {
      ...existingReview,
      rating: 5,
      reviewText: 'Updated: Even better than before!',
      createdAt: new Date(),
    };

    it('should update a review successfully', async () => {
      reviewRepository.findById.mockResolvedValue(existingReview);
      reviewRepository.update.mockResolvedValue(updatedReview);
      ratingService.computeRating.mockResolvedValue({
        rating: updatedReview.rating,
        count: 1,
        lastUpdatedAt: new Date(),
      });

      const result = await service.update(updateInput);

      expect(reviewRepository.findById).toHaveBeenCalledWith(
        updateInput.reviewId,
      );
      expect(reviewRepository.update).toHaveBeenCalledWith(
        updateInput.reviewId,
        updateInput,
      );
      expect(ratingService.computeRating).toHaveBeenCalledWith(
        updateInput.restaurantId,
      );
      expect(result).toEqual(updatedReview);
    });

    it('should throw NotFoundException if review not found', async () => {
      reviewRepository.findById.mockResolvedValue(null);

      await expect(service.update(updateInput)).rejects.toThrow(
        new NotFoundException(
          `Review with id ${updateInput.reviewId} not found`,
        ),
      );
      expect(reviewRepository.update).not.toHaveBeenCalled();
      expect(ratingService.computeRating).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if review restaurant does not match', async () => {
      const reviewWithDifferentRestaurant = {
        ...existingReview,
        restaurantId: 'different-restaurant',
      };
      reviewRepository.findById.mockResolvedValue(
        reviewWithDifferentRestaurant,
      );

      await expect(service.update(updateInput)).rejects.toThrow(
        new NotFoundException(
          `Review with id ${updateInput.reviewId} not found`,
        ),
      );
      expect(reviewRepository.update).not.toHaveBeenCalled();
      expect(ratingService.computeRating).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user is not the author', async () => {
      const reviewWithDifferentUser = {
        ...existingReview,
        userId: 'different-user',
      };
      reviewRepository.findById.mockResolvedValue(reviewWithDifferentUser);

      await expect(service.update(updateInput)).rejects.toThrow(
        new UnauthorizedException(
          'You are not authorized to update this review',
        ),
      );
      expect(reviewRepository.update).not.toHaveBeenCalled();
      expect(ratingService.computeRating).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const deleteInput = {
      userId: 'user-123',
      restaurantId: 'restaurant-123',
      reviewId: 'review-123',
    };

    const existingReview: Review = {
      id: 'review-123',
      userId: 'user-123',
      restaurantId: 'restaurant-123',
      rating: 4,
      reviewText: 'Great restaurant!',
      createdAt: new Date(),
    };

    it('should delete a review successfully', async () => {
      reviewRepository.findById.mockResolvedValue(existingReview);
      reviewRepository.delete.mockResolvedValue({ id: existingReview.id });
      ratingService.computeRating.mockResolvedValue({
        rating: existingReview.rating,
        count: 1,
        lastUpdatedAt: new Date(),
      });

      const result = await service.delete(deleteInput);

      expect(reviewRepository.findById).toHaveBeenCalledWith(
        deleteInput.reviewId,
      );
      expect(reviewRepository.delete).toHaveBeenCalledWith(
        deleteInput.reviewId,
      );
      expect(ratingService.computeRating).toHaveBeenCalledWith(
        deleteInput.restaurantId,
      );
      expect(result).toEqual({ id: existingReview.id });
    });

    it('should throw NotFoundException if review not found', async () => {
      reviewRepository.findById.mockResolvedValue(null);

      await expect(service.delete(deleteInput)).rejects.toThrow(
        new NotFoundException(
          `Review with id ${deleteInput.reviewId} not found`,
        ),
      );
      expect(reviewRepository.delete).not.toHaveBeenCalled();
      expect(ratingService.computeRating).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if review restaurant does not match', async () => {
      const reviewWithDifferentRestaurant = {
        ...existingReview,
        restaurantId: 'different-restaurant',
      };
      reviewRepository.findById.mockResolvedValue(
        reviewWithDifferentRestaurant,
      );

      await expect(service.delete(deleteInput)).rejects.toThrow(
        new NotFoundException(
          `Review with id ${deleteInput.reviewId} not found`,
        ),
      );
      expect(reviewRepository.delete).not.toHaveBeenCalled();
      expect(ratingService.computeRating).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user is not the author', async () => {
      const reviewWithDifferentUser = {
        ...existingReview,
        userId: 'different-user',
      };
      reviewRepository.findById.mockResolvedValue(reviewWithDifferentUser);

      await expect(service.delete(deleteInput)).rejects.toThrow(
        new UnauthorizedException(
          'You are not authorized to delete this review',
        ),
      );
      expect(reviewRepository.delete).not.toHaveBeenCalled();
      expect(ratingService.computeRating).not.toHaveBeenCalled();
    });
  });
});
