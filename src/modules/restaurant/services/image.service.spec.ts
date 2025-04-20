/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { ImageRepository } from '../repositories/image.repository';
import { CloudService } from '../../shared/services/cloud.service';
import { Image } from '../entities/image.entity';
import { AuthUser } from '../../../common/interfaces/auth.interface';

describe('ImageService', () => {
  let service: ImageService;
  let imageRepository: jest.Mocked<ImageRepository>;
  let cloudService: jest.Mocked<CloudService>;

  const mockImageRepository = () => ({
    create: jest.fn(),
  });

  const mockCloudService = () => ({
    upload: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        {
          provide: ImageRepository,
          useFactory: mockImageRepository,
        },
        {
          provide: CloudService,
          useFactory: mockCloudService,
        },
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);
    imageRepository = module.get(ImageRepository);
    cloudService = module.get(CloudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    it('should upload an image successfully', async () => {
      const mockFile = {
        fieldname: 'image',
        originalname: 'test-image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test image content'),
        size: 1024,
      } as Express.Multer.File;

      const mockUser: AuthUser = {
        userId: 'user-123',
        email: 'test@example.com',
      };

      const mockCloudResponse = {
        url: 'https://cloudprovider.com/images/test-image.jpg',
        publicId: 'images/test-image',
      };

      const mockImageEntity: Image = {
        imageId: 'image-123',
        url: 'https://cloudprovider.com/images/test-image.jpg',
        userId: 'user-123',
        uploadedAt: new Date(),
      };

      cloudService.upload.mockResolvedValue(mockCloudResponse);
      imageRepository.create.mockResolvedValue(mockImageEntity);

      const result = await service.upload(mockFile, mockUser);

      expect(cloudService.upload).toHaveBeenCalledWith(mockFile);

      expect(imageRepository.create).toHaveBeenCalledWith({
        url: mockCloudResponse.url,
        userId: mockUser.userId,
      });

      expect(result).toEqual(mockImageEntity);
    });

    it('should propagate errors from cloud service', async () => {
      const mockFile = {
        fieldname: 'image',
        originalname: 'test-image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test image content'),
        size: 1024,
      } as Express.Multer.File;

      const mockUser: AuthUser = {
        userId: 'user-123',
        email: 'test@example.com',
      };

      const uploadError = new Error('Failed to upload to cloud storage');
      cloudService.upload.mockRejectedValue(uploadError);

      await expect(service.upload(mockFile, mockUser)).rejects.toThrow(
        uploadError,
      );

      expect(cloudService.upload).toHaveBeenCalledWith(mockFile);

      expect(imageRepository.create).not.toHaveBeenCalled();
    });

    it('should propagate errors from image repository', async () => {
      const mockFile = {
        fieldname: 'image',
        originalname: 'test-image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test image content'),
        size: 1024,
      } as Express.Multer.File;

      const mockUser: AuthUser = {
        userId: 'user-123',
        email: 'test@example.com',
      };

      const mockCloudResponse = {
        url: 'https://cloudprovider.com/images/test-image.jpg',
        publicId: 'images/test-image',
      };

      cloudService.upload.mockResolvedValue(mockCloudResponse);

      const repositoryError = new Error('Failed to create image record');
      imageRepository.create.mockRejectedValue(repositoryError);

      await expect(service.upload(mockFile, mockUser)).rejects.toThrow(
        repositoryError,
      );

      expect(cloudService.upload).toHaveBeenCalledWith(mockFile);

      expect(imageRepository.create).toHaveBeenCalledWith({
        url: mockCloudResponse.url,
        userId: mockUser.userId,
      });
    });

    it('should handle various file types', async () => {
      const mockPngFile = {
        fieldname: 'image',
        originalname: 'test-image.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('test png content'),
        size: 2048,
      } as Express.Multer.File;

      const mockUser: AuthUser = {
        userId: 'user-123',
        email: 'test@example.com',
      };

      const mockCloudResponse = {
        url: 'https://cloudprovider.com/images/test-image.png',
        publicId: 'images/test-image-png',
      };

      const mockImageEntity: Image = {
        imageId: 'image-456',
        url: 'https://cloudprovider.com/images/test-image.png',
        userId: 'user-123',
        uploadedAt: new Date(),
      };

      cloudService.upload.mockResolvedValue(mockCloudResponse);
      imageRepository.create.mockResolvedValue(mockImageEntity);

      const result = await service.upload(mockPngFile, mockUser);

      expect(cloudService.upload).toHaveBeenCalledWith(mockPngFile);

      expect(imageRepository.create).toHaveBeenCalledWith({
        url: mockCloudResponse.url,
        userId: mockUser.userId,
      });

      expect(result).toEqual(mockImageEntity);
    });

    it('should work with different user contexts', async () => {
      const mockFile = {
        fieldname: 'image',
        originalname: 'test-image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test image content'),
        size: 1024,
      } as Express.Multer.File;

      const differentUser: AuthUser = {
        userId: 'user-456',
        email: 'another@example.com',
      };

      const mockCloudResponse = {
        url: 'https://cloudprovider.com/images/test-image.jpg',
        publicId: 'images/test-image',
      };

      const mockImageEntity: Image = {
        imageId: 'image-789',
        url: 'https://cloudprovider.com/images/test-image.jpg',
        userId: 'user-456',
        uploadedAt: new Date(),
      };

      cloudService.upload.mockResolvedValue(mockCloudResponse);
      imageRepository.create.mockResolvedValue(mockImageEntity);

      const result = await service.upload(mockFile, differentUser);

      expect(cloudService.upload).toHaveBeenCalledWith(mockFile);

      expect(imageRepository.create).toHaveBeenCalledWith({
        url: mockCloudResponse.url,
        userId: differentUser.userId,
      });

      expect(result).toEqual(mockImageEntity);
    });
  });
});
