import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RestaurantService } from '../services/restaurant.service';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { Restaurant } from '../entities/restaurant.entity';
import status from 'http-status';

import { AuthUser } from 'src/common/interfaces/auth.interface';
import { User } from 'src/common/decorators/user.decorator';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @User() user: AuthUser,
  ): Promise<Restaurant> {
    return await this.restaurantService.create(createRestaurantDto, user);
  }

  @Get()
  async findAll(): Promise<{ restaurants: Restaurant[] }> {
    return await this.restaurantService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Restaurant | null> {
    return await this.restaurantService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateRestaurantDto: UpdateRestaurantDto,
    @User() user: AuthUser,
  ): Promise<Restaurant> {
    return await this.restaurantService.update(id, updateRestaurantDto, user);
  }

  @Delete(':id')
  @HttpCode(status.NO_CONTENT)
  async delete(@Param('id') id: string, @User() user: AuthUser): Promise<void> {
    await this.restaurantService.delete(id, user);
    return;
  }
}
