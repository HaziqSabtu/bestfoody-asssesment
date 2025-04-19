import { Review } from '../entities/review.entity';

export type createInput = {
  reviewText: Review['reviewText'];
  rating: Review['rating'];
  userId: Review['userId'];
  restaurantId: Review['restaurantId'];
};

export type updateInput = Partial<Pick<Review, 'reviewText' | 'rating'>>;

export abstract class ReviewRepository {
  abstract create(Review: createInput): Promise<Review>;
  abstract findById(id: string): Promise<Review | null>;
  abstract findOneByUserIdAndRestaurantId(
    userId: string,
    restaurantId: string,
  ): Promise<Review | null>;
  abstract findAllByRestaurantId(restaurantId: string): Promise<Review[]>;
  abstract update(id: string, data: updateInput): Promise<Review>;
  abstract delete(id: string): Promise<{ id: Review['id'] }>;
}
