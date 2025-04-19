export class Review {
  public readonly id: string;
  public readonly rating: number;
  public readonly reviewText: string | null;
  public readonly userId: string;
  public readonly restaurantId: string;
  public readonly createdAt: Date;

  constructor({
    id,
    rating,
    reviewText,
    createdAt,
    userId,
    restaurantId,
  }: {
    id: string;
    rating: number;
    reviewText: string | null;
    createdAt: Date;
    userId: string;
    restaurantId: string;
  }) {
    this.id = id;
    this.rating = rating;
    this.reviewText = reviewText ?? null;
    this.createdAt = createdAt;
    this.userId = userId;
    this.restaurantId = restaurantId;
  }
}
