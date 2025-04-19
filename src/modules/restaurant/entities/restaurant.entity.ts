import { Rating } from './rating.entity';

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

  constructor({
    id,
    name,
    category,
    imageUrl,
    rating,
  }: {
    id: string;
    name: string;
    category: RestaurantCategoryType;
    imageUrl?: string;
    rating: Rating;
  }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.imageUrl = imageUrl;
    this.rating = rating;

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
  }
}
