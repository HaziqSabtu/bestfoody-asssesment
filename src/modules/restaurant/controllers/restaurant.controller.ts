import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { RestaurantService } from '../services/restaurant.service';
import { PrismaService } from '../../shared/services/prisma.service';
import {
  CreateRestaurantDto,
  createRestaurantSchema,
} from '../dtos/create-restaurant.dto';
import {
  UpdateRestaurantDto,
  updateRestaurantSchema,
} from '../dtos/update-restaurant.dto';
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

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Restaurant | null> {
    return await this.restaurantService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateRestaurantSchema))
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    return await this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.restaurantService.delete(id);
  }
}
