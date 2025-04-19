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

@Controller('restaurants/:restaurantId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(
    @Param('restaurantId') restaurantId: string,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return await this.reviewService.create({
      ...createReviewDto,
      userId: 'a4c1c840-3d36-4793-a0c3-82aa5c20b9cc',
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
  ): Promise<Review> {
    return await this.reviewService.update(reviewId, updateReviewDto);
  }

  @Delete(':reviewId')
  @HttpCode(status.NO_CONTENT)
  async delete(
    @Param('restaurantId', ParamParsePipe) restaurantId: string,
    @Param('reviewId', ParamParsePipe) reviewId: string,
  ): Promise<void> {
    await this.reviewService.delete(reviewId);
    return;
  }
}
