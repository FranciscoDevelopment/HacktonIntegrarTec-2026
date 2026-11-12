import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDto } from './dto/get-weather.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  getCurrent(@Query() { latitude, longitude }: GetWeatherDto) {
    return this.weatherService.getCurrent(latitude, longitude);
  }
}
