/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  const mockUserRepository = {
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: 'user-123',
        email,
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
        createdAt: new Date(),
      } as User;

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw NotFoundException if user not found', async () => {
      const email = 'nonexistent@example.com';

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(service.findByEmail(email)).rejects.toThrow(
        new NotFoundException(`User with email ${email} not found`),
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });
});
