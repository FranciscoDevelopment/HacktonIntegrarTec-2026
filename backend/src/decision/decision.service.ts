import { Injectable, Logger } from '@nestjs/common';
import { DishesService } from '../dishes/dishes.service';
import { WeatherService } from '../weather/weather.service';
import { weatherT } from '../weather/types/weather.type';
import { CreateDecisionDto } from './dto/create-decision.dto';
import { decisionT } from './types/decision.type';
import { rankDishes, sumCategoryTotals, sumStyleTotals } from './utils/scoring';

@Injectable()
export class DecisionService {
  private readonly logger = new Logger(DecisionService.name);

  constructor(
    private readonly dishesService: DishesService,
    private readonly weatherService: WeatherService,
  ) {}

  async decide({
    participants,
    latitude,
    longitude,
  }: CreateDecisionDto): Promise<decisionT> {
    const weather = await this.getWeatherOrNull(latitude, longitude);

    const categoryTotals = sumCategoryTotals(participants);

    const styleTotals = sumStyleTotals(
      participants,
      weather?.climateBonus ?? null,
    );

    const scored = rankDishes(
      this.dishesService.findAll(),
      categoryTotals,
      styleTotals,
    );

    const ranking = await this.dishesService.withMedia(scored);

    return {
      winner: ranking[0],
      ranking,
      categoryTotals,
      styleTotals,
      weather,
      participantsCount: participants.length,
      decidedAt: new Date().toISOString(),
    };
  }

  // Si el clima no responde, se decide igual, sin el voto del clima
  private async getWeatherOrNull(
    latitude?: number,
    longitude?: number,
  ): Promise<weatherT | null> {
    try {
      return await this.weatherService.getCurrent(latitude, longitude);
    } catch {
      this.logger.warn('Se decide sin el voto del clima');

      return null;
    }
  }
}
