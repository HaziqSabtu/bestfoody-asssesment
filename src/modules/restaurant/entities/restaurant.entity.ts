import { Rating } from './rating.entity';
import { Image } from './image.entity';

export enum RestaurantCategoryEnum {
  MALAYSIAN = 'MALAYSIAN',
  INDIAN = 'INDIAN',
  CHINESE = 'CHINESE',
  JAPANESE = 'JAPANESE',
  ITALIAN = 'ITALIAN',
}

export type RestaurantCategoryType = keyof typeof RestaurantCategoryEnum;

export class Restaurant {
  public readonly id: string;
  public name: string;
  public category: RestaurantCategoryType;
  public imageUrl?: string;
  public rating: Rating;
  public image: Image | null;
  public userId: string;

  constructor({
    id,
    name,
    category,
    imageUrl,
    rating,
    image,
    userId,
  }: {
    id: string;
    name: string;
    category: RestaurantCategoryType;
    imageUrl?: string;
    rating: Rating;
    userId: string;
    image: Image | null;
  }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.imageUrl = imageUrl;
    this.rating = rating;
    this.userId = userId;
    this.image = image;

    this.validate();
  }

  private validate() {
    if (!this.id) {
      throw new Error('Restaurant id is required');
    }
    if (!this.name) {
      throw new Error('Restaurant name is required');
    }
    if (!this.category) {
      throw new Error('Restaurant category is required');
    }
    if (!this.userId) {
      throw new Error('Restaurant userId is required');
    }
  }

  update(data: Partial<Restaurant>) {
    this.name = data.name ?? this.name;
    this.category = data.category ?? this.category;

    return this;
  }
}
