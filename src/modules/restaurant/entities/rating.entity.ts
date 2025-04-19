export class Rating {
  public readonly rating: number;
  public readonly count: number;
  public readonly lastUpdatedAt: Date;

  constructor({ rating = 0, count = 0, lastUpdatedAt = new Date() }) {
    this.rating = rating;
    this.count = count;
    this.lastUpdatedAt = lastUpdatedAt;
  }
}
