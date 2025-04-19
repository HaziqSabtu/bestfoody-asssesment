export class Image {
  public readonly imageId: string;
  public readonly url: string;
  public readonly uploadedAt: Date;

  constructor({
    imageId,
    url,
    uploadedAt,
  }: {
    imageId: string;
    url: string;
    uploadedAt: Date;
  }) {
    this.imageId = imageId;
    this.url = url;
    this.uploadedAt = uploadedAt;
  }
}
