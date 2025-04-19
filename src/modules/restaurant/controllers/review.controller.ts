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
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { UpdateReviewDto } from '../dtos/update-review.dto';
import { Review } from '../entities/review.entity';
import status from 'http-status';

import { ParamParsePipe } from '../../../common/pipes/param-parse.pipe';

import { AuthUser } from 'src/common/interfaces/auth.interface';
import { User } from 'src/common/decorators/user.decorator';

@Controller('restaurants/:restaurantId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(
    @Param('restaurantId') restaurantId: string,
    @Body() createReviewDto: CreateReviewDto,
    @User() user: AuthUser,
  ): Promise<Review> {
    return await this.reviewService.create({
      ...createReviewDto,
      userId: user.userId,
      restaurantId,
    });
  }

  @Get()
  async findAllByRestaurantId(
    @Param('restaurantId') restaurantId: string,
  ): Promise<{ reviews: Review[] }> {
    return await this.reviewService.findAllByRestaurantId(restaurantId);
  }

  @Put(':reviewId')
  async update(
    @Param('restaurantId', ParamParsePipe) restaurantId: string,
    @Param('reviewId', ParamParsePipe) reviewId: string,
    @Body()
    updateReviewDto: UpdateReviewDto,
    @User() user: AuthUser,
  ): Promise<Review> {
    return await this.reviewService.update({
      ...updateReviewDto,
      userId: user.userId,
      restaurantId,
      reviewId,
    });
  }

  @Delete(':reviewId')
  @HttpCode(status.NO_CONTENT)
  async delete(
    @Param('restaurantId', ParamParsePipe) restaurantId: string,
    @Param('reviewId', ParamParsePipe) reviewId: string,
    @User() user: AuthUser,
  ): Promise<void> {
    await this.reviewService.delete({
      userId: user.userId,
      restaurantId,
      reviewId,
    });
    return;
  }
}
