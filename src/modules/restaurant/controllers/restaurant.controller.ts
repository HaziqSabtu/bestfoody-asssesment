import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { RestaurantService } from '../services/restaurant.service';
import { PrismaService } from '../../shared/services/prisma.service';
import {
  CreateRestaurantDto,
  createRestaurantSchema,
} from '../dtos/create-restaurant.dto';
import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { Restaurant } from '../entities/restaurant.entity';

@Controller('restaurants')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createRestaurantSchema))
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    return await this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  async findAll(): Promise<Restaurant[]> {
    return await this.restaurantService.findAll();
  }
}
