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

  constructor({
    id,
    name,
    category,
    imageUrl,
  }: {
    id: string;
    name: string;
    category: RestaurantCategoryType;
    imageUrl?: string;
  }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.imageUrl = imageUrl;

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
