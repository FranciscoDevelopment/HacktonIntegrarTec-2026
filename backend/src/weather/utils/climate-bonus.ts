import { FoodStyleEnum } from '../../common/enums/food-style.enum';
import { roundTo } from '../../common/utils/round';
import { climateBonusT } from '../types/weather.type';

// Temperatura en la que el clima no opina
export const NEUTRAL_TEMPERATURE = 20;

export const POINTS_PER_DEGREE = 0.1;

// El clima pesa, como mucho, lo mismo que un comensal más
export const MAX_CLIMATE_POINTS = 1;

export function calculateClimateBonus(temperature: number): climateBonusT {
  const difference = NEUTRAL_TEMPERATURE - temperature;

  const points = roundTo(
    Math.min(Math.abs(difference) * POINTS_PER_DEGREE, MAX_CLIMATE_POINTS),
  );

  if (points === 0) return { style: null, points: 0 };

  return {
    style: difference > 0 ? FoodStyleEnum.CONTUNDENTE : FoodStyleEnum.FITNESS,
    points,
  };
}
