import { Controller, Get } from '@nestjs/common';
import { DishesService } from './dishes.service';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  findAll() {
    return this.dishesService.findAllWithMedia();
  }
}
