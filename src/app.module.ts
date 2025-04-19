import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './modules/shared/shared.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';

@Module({
  imports: [SharedModule, RestaurantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
