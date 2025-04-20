/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { SignInDto } from '../dtos/signin.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUserService = () => ({
    findByEmail: jest.fn(),
  });

  const mockJwtService = () => ({
    signAsync: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useFactory: mockUserService,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);

    // Mock Date.now for consistent test results
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(1609459200000); // 2021-01-01
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser: User = {
      id: 'user-123',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
    };

    const mockToken = 'mock.jwt.token';

    it('should successfully sign in with valid credentials', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.signIn(signInDto);

      expect(userService.findByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          email: mockUser.email,
          userId: mockUser.id,
          iss: 'bestfoody-asssesment',
          aud: 'bestfoody-asssesment',
        },
        {
          expiresIn: '1h',
        },
      );

      expect(result).toEqual({
        token: mockToken,
        expiresAt: new Date(1609459200000 + 60 * 60 * 1000), // 1 hour after mock time
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
      });
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const userWithDifferentPassword = {
        ...mockUser,
        password: 'different-password',
      };
      userService.findByEmail.mockResolvedValue(userWithDifferentPassword);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException('Wrong email or password'),
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw errors from userService', async () => {
      const errorMessage = 'Database connection error';
      userService.findByEmail.mockRejectedValue(new Error(errorMessage));

      await expect(service.signIn(signInDto)).rejects.toThrow(errorMessage);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw errors from jwtService', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      const errorMessage = 'JWT signing error';
      jwtService.signAsync.mockRejectedValue(new Error(errorMessage));

      await expect(service.signIn(signInDto)).rejects.toThrow(errorMessage);
      expect(jwtService.signAsync).toHaveBeenCalled();
    });

    it('should call jwtService with the correct payload', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue(mockToken);

      await service.signIn(signInDto);

      const expectedPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        userId: mockUser.id,
        iss: 'bestfoody-asssesment',
        aud: 'bestfoody-asssesment',
      };

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expectedPayload,
        expect.any(Object),
      );
    });
  });
});
