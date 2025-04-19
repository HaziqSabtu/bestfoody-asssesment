import { Module } from '@nestjs/common';
import { RestaurantController } from './controllers/restaurant.controller';
import { RestaurantService } from './services/restaurant.service';
import { RestaurantRepository } from './repositories/restaurant.repository';
import { RestaurantPrismaRepository } from './repositories/restaurant.prisma.repository';

@Module({
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    {
      provide: RestaurantRepository,
      useClass: RestaurantPrismaRepository,
    },
  ],
})
export class RestaurantModule {}
