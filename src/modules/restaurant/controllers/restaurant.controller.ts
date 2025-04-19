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

import { ParamParsePipe } from '../../../common/pipes/param-parse.pipe';

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
    return await this.restaurantService.create({
      ...createRestaurantDto,
      userId: user.userId,
    });
  }

  @Get()
  async findAll(): Promise<{ restaurants: Restaurant[] }> {
    return await this.restaurantService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Restaurant | null> {
    return await this.restaurantService.findById(id);
  }

  @Put(':restaurantId')
  async update(
    @Param('restaurantId', ParamParsePipe) restaurantId: string,
    @Body()
    updateRestaurantDto: UpdateRestaurantDto,
    @User() user: AuthUser,
  ): Promise<Restaurant> {
    return await this.restaurantService.update({
      ...updateRestaurantDto,
      userId: user.userId,
      restaurantId: restaurantId,
    });
  }

  @Delete(':restaurantId')
  @HttpCode(status.NO_CONTENT)
  async delete(
    @Param('restaurantId', ParamParsePipe) restaurantId: string,
  ): Promise<void> {
    await this.restaurantService.delete({
      restaurantId,
      userId: 'a4c1c840-3d36-4793-a0c3-82aa5c20b9cc',
    });

    return;
  }
}
