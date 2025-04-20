/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import { ImageRepository } from '../repositories/image.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import {
  Restaurant,
  RestaurantCategoryEnum,
} from '../entities/restaurant.entity';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let restaurantRepository: jest.Mocked<RestaurantRepository>;
  let imageRepository: jest.Mocked<ImageRepository>;

  const mockRestaurantRepository = () => ({
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  const mockImageRepository = () => ({
    findByIdAndUserId: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: RestaurantRepository,
          useFactory: mockRestaurantRepository,
        },
        {
          provide: ImageRepository,
          useFactory: mockImageRepository,
        },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    restaurantRepository = module.get(RestaurantRepository);
    imageRepository = module.get(ImageRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createInput: CreateRestaurantDto & { userId: string } = {
      name: 'Test Restaurant',
      userId: 'user-123',
      imageId: 'image-123',
      category: RestaurantCategoryEnum.MALAYSIAN,
    };

    const mockRestaurant: Restaurant = {
      id: 'restaurant-123',
      name: 'Test Restaurant',
      userId: 'user-123',
      category: RestaurantCategoryEnum.MALAYSIAN,
      image: {
        imageId: 'image-123',
        url: 'https://example.com/image.jpg',
        userId: 'user-123',
        uploadedAt: new Date(),
      },
      rating: {
        rating: 4.5,
        count: 10,
        lastUpdatedAt: new Date(),
      },
    };

    it('should create a restaurant successfully', async () => {
      imageRepository.findByIdAndUserId.mockResolvedValue({
        imageId: 'image-123',
        url: 'https://example.com/image.jpg',
        userId: 'user-123',
        uploadedAt: new Date(),
      });
      restaurantRepository.create.mockResolvedValue(mockRestaurant);

      const result = await service.create(createInput);

      expect(imageRepository.findByIdAndUserId).toHaveBeenCalledWith(
        'image-123',
        'user-123',
      );
      expect(restaurantRepository.create).toHaveBeenCalledWith(createInput);
      expect(result).toEqual(mockRestaurant);
    });

    it('should create a restaurant without image', async () => {
      const inputWithoutImage = { ...createInput, imageId: undefined };
      restaurantRepository.create.mockResolvedValue({
        ...mockRestaurant,
        image: null,
      });

      const result = await service.create(inputWithoutImage);

      expect(imageRepository.findByIdAndUserId).not.toHaveBeenCalled();
      expect(restaurantRepository.create).toHaveBeenCalledWith(
        inputWithoutImage,
      );
      expect(result).toEqual({ ...mockRestaurant, image: null });
    });

    it('should throw NotFoundException if image not found', async () => {
      imageRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.create(createInput)).rejects.toThrow(
        new NotFoundException(`Image with id ${createInput.imageId} not found`),
      );
      expect(restaurantRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    const mockRestaurant: Restaurant = {
      id: 'restaurant-123',
      name: 'Test Restaurant',
      category: RestaurantCategoryEnum.MALAYSIAN,
      userId: 'user-123',
      image: null,
      rating: {
        rating: 4.5,
        count: 10,
        lastUpdatedAt: new Date(),
      },
    };

    it('should find a restaurant by id', async () => {
      restaurantRepository.findById.mockResolvedValue(mockRestaurant);

      const result = await service.findById('restaurant-123');

      expect(restaurantRepository.findById).toHaveBeenCalledWith(
        'restaurant-123',
      );
      expect(result).toEqual(mockRestaurant);
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      restaurantRepository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        new NotFoundException('Restaurant with id non-existent not found'),
      );
    });
  });

  describe('findAll', () => {
    const mockRestaurants = [
      {
        id: 'restaurant-1',
        name: 'Restaurant 1',
        category: RestaurantCategoryEnum.MALAYSIAN,
        userId: 'user-1',
        image: null,
        rating: {
          rating: 4.5,
          count: 10,
          lastUpdatedAt: new Date(),
        },
      },
      {
        id: 'restaurant-2',
        name: 'Restaurant 2',
        category: RestaurantCategoryEnum.MALAYSIAN,
        userId: 'user-2',
        image: null,
        rating: {
          rating: 4.5,
          count: 10,
          lastUpdatedAt: new Date(),
        },
      },
    ];

    const mockResponse = {
      restaurants: mockRestaurants,
      nextCursor: 'next-cursor',
    };

    it('should find all restaurants with given criteria', async () => {
      restaurantRepository.findAll.mockResolvedValue(mockResponse);

      const findAllInput = {
        category: RestaurantCategoryEnum.ITALIAN,
        name: 'Pizza',
        cursor: 'current-cursor',
        take: 10,
      };

      const result = await service.findAll(findAllInput);

      expect(restaurantRepository.findAll).toHaveBeenCalledWith(findAllInput);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    const updateInput: UpdateRestaurantDto & {
      userId: string;
      restaurantId: string;
    } = {
      name: 'Updated Restaurant',
      category: RestaurantCategoryEnum.MALAYSIAN,
      userId: 'user-123',
      restaurantId: 'restaurant-123',
      imageId: 'new-image-123',
    };

    const existingRestaurant: Restaurant = {
      id: 'restaurant-123',
      name: 'Test Restaurant',
      category: RestaurantCategoryEnum.MALAYSIAN,
      userId: 'user-123',
      image: {
        imageId: 'old-image-123',
        url: 'https://example.com/old-image.jpg',
        userId: 'user-123',
        uploadedAt: new Date(),
      },
      rating: {
        rating: 4.5,
        count: 10,
        lastUpdatedAt: new Date(),
      },
    };

    const updatedRestaurant: Restaurant = {
      ...existingRestaurant,
      name: 'Updated Restaurant',
      image: {
        imageId: 'new-image-123',
        url: 'https://example.com/new-image.jpg',
        userId: 'user-123',
        uploadedAt: new Date(),
      },
    };

    it('should update a restaurant successfully', async () => {
      restaurantRepository.findById.mockResolvedValue(existingRestaurant);
      imageRepository.findByIdAndUserId.mockResolvedValue({
        imageId: 'new-image-123',
        url: 'https://example.com/new-image.jpg',
        userId: 'user-123',
        uploadedAt: new Date(),
      });
      restaurantRepository.update.mockResolvedValue(updatedRestaurant);

      const result = await service.update(updateInput);

      expect(restaurantRepository.findById).toHaveBeenCalledWith(
        'restaurant-123',
      );
      expect(imageRepository.findByIdAndUserId).toHaveBeenCalledWith(
        'new-image-123',
        'user-123',
      );
      expect(restaurantRepository.update).toHaveBeenCalledWith(
        'restaurant-123',
        updateInput,
      );
      expect(result).toEqual(updatedRestaurant);
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      restaurantRepository.findById.mockResolvedValue(null);

      await expect(service.update(updateInput)).rejects.toThrow(
        new NotFoundException('Restaurant with id restaurant-123 not found'),
      );
      expect(restaurantRepository.update).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const differentUserRestaurant = {
        ...existingRestaurant,
        userId: 'different-user',
      };
      restaurantRepository.findById.mockResolvedValue(differentUserRestaurant);

      await expect(service.update(updateInput)).rejects.toThrow(
        new UnauthorizedException(
          'You are not authorized to update this restaurant',
        ),
      );
      expect(restaurantRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if new image not found', async () => {
      restaurantRepository.findById.mockResolvedValue(existingRestaurant);
      imageRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.update(updateInput)).rejects.toThrow(
        new NotFoundException('Image with id new-image-123 not found'),
      );
      expect(restaurantRepository.update).not.toHaveBeenCalled();
    });

    it('should not check for image if imageId is not changed', async () => {
      const inputWithSameImage = {
        ...updateInput,
        imageId: 'old-image-123',
      };
      restaurantRepository.findById.mockResolvedValue(existingRestaurant);
      restaurantRepository.update.mockResolvedValue({
        ...updatedRestaurant,
        image: existingRestaurant.image,
      });

      await service.update(inputWithSameImage);

      expect(imageRepository.findByIdAndUserId).not.toHaveBeenCalled();
      expect(restaurantRepository.update).toHaveBeenCalledWith(
        'restaurant-123',
        inputWithSameImage,
      );
    });

    it('should not check for image if no imageId provided', async () => {
      const inputWithoutImage = { ...updateInput, imageId: undefined };
      restaurantRepository.findById.mockResolvedValue(existingRestaurant);
      restaurantRepository.update.mockResolvedValue({
        ...updatedRestaurant,
        image: existingRestaurant.image,
      });

      await service.update(inputWithoutImage);

      expect(imageRepository.findByIdAndUserId).not.toHaveBeenCalled();
      expect(restaurantRepository.update).toHaveBeenCalledWith(
        'restaurant-123',
        inputWithoutImage,
      );
    });
  });

  describe('delete', () => {
    const deleteInput = {
      userId: 'user-123',
      restaurantId: 'restaurant-123',
    };

    const existingRestaurant: Restaurant = {
      id: 'restaurant-123',
      name: 'Test Restaurant',
      category: RestaurantCategoryEnum.MALAYSIAN,
      userId: 'user-123',
      image: null,
      rating: {
        rating: 4.5,
        count: 10,
        lastUpdatedAt: new Date(),
      },
    };

    it('should delete a restaurant successfully', async () => {
      restaurantRepository.findById.mockResolvedValue(existingRestaurant);
      restaurantRepository.delete.mockResolvedValue({ id: 'restaurant-123' });

      const result = await service.delete(deleteInput);

      expect(restaurantRepository.findById).toHaveBeenCalledWith(
        'restaurant-123',
      );
      expect(restaurantRepository.delete).toHaveBeenCalledWith(
        'restaurant-123',
      );
      expect(result).toEqual({ id: 'restaurant-123' });
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      restaurantRepository.findById.mockResolvedValue(null);

      await expect(service.delete(deleteInput)).rejects.toThrow(
        new NotFoundException('Restaurant with id restaurant-123 not found'),
      );
      expect(restaurantRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const differentUserRestaurant = {
        ...existingRestaurant,
        userId: 'different-user',
      };
      restaurantRepository.findById.mockResolvedValue(differentUserRestaurant);

      await expect(service.delete(deleteInput)).rejects.toThrow(
        new UnauthorizedException(
          'You are not authorized to delete this restaurant',
        ),
      );
      expect(restaurantRepository.delete).not.toHaveBeenCalled();
    });
  });
});
