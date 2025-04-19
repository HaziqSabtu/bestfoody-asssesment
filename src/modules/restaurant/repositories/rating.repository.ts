import { Rating } from '../entities/rating.entity';

export type createInput = {
  restaurantId: string;
  rating: Rating['rating'];
  count: Rating['count'];
};

export abstract class RatingRepository {
  abstract upsert(restaurant: createInput): Promise<Rating>;
}
