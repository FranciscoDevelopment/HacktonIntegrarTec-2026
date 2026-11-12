import { FoodStyleEnum } from '../../common/enums/food-style.enum';

export type climateBonusT = {
  style: FoodStyleEnum | null;
  points: number;
};

export type weatherT = {
  temperature: number;
  latitude: number;
  longitude: number;
  locationLabel: string;
  isDefaultLocation: boolean;
  observedAt: string;
  climateBonus: climateBonusT;
};

export type openMeteoCurrentResponseT = {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m: number;
  };
};
