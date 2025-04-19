import { Image } from '../entities/image.entity';

export type createInput = {
  url: Image['url'];
  userId: Image['userId'];
};

export abstract class ImageRepository {
  abstract create(Image: createInput): Promise<Image>;
  abstract findByIdAndUserId(
    imageId: string,
    userId: string,
  ): Promise<Image | null>;
}
