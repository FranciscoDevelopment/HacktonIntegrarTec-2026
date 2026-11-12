import { Module } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishesController } from './dishes.controller';
import { WikipediaService } from './wikipedia.service';

@Module({
  controllers: [DishesController],
  providers: [DishesService, WikipediaService],
  exports: [DishesService],
})
export class DishesModule {}
