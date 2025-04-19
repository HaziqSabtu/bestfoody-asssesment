import { Module } from '@nestjs/common';
import { RestaurantController } from './controllers/restaurant.controller';
import { RestaurantService } from './services/restaurant.service';
import { RestaurantRepository } from './repositories/restaurant.repository';
import { RestaurantPrismaRepository } from './repositories/restaurant.prisma.repository';

import { ReviewController } from './controllers/review.controller';
import { ReviewService } from './services/review.service';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewPrismaRepository } from './repositories/review.prisma.repository';

@Module({
  controllers: [RestaurantController, ReviewController],
  providers: [
    RestaurantService,
    {
      provide: RestaurantRepository,
      useClass: RestaurantPrismaRepository,
    },
    ReviewService,
    {
      provide: ReviewRepository,
      useClass: ReviewPrismaRepository,
    },
  ],
})
export class RestaurantModule {}
