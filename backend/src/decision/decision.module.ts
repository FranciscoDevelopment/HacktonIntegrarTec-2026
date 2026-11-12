import { Module } from '@nestjs/common';
import { DishesModule } from '../dishes/dishes.module';
import { WeatherModule } from '../weather/weather.module';
import { DecisionService } from './decision.service';
import { DecisionController } from './decision.controller';

@Module({
  imports: [DishesModule, WeatherModule],
  controllers: [DecisionController],
  providers: [DecisionService],
})
export class DecisionModule {}
