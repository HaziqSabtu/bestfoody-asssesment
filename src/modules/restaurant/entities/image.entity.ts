export class Image {
  public readonly imageId: string;
  public readonly url: string;
  public readonly userId: string;
  public readonly uploadedAt: Date;

  constructor({
    imageId,
    url,
    uploadedAt,
    userId,
  }: {
    imageId: string;
    url: string;
    uploadedAt: Date;
    userId: string;
  }) {
    this.imageId = imageId;
    this.url = url;
    this.uploadedAt = uploadedAt;
    this.userId = userId;
  }
}
