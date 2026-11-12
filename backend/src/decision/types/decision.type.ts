import { CategoryEnum } from '../../common/enums/category.enum';
import { CravingLevelEnum } from '../../common/enums/craving-level.enum';
import { FoodStyleEnum } from '../../common/enums/food-style.enum';
import { dishT, dishWithMediaT } from '../../dishes/types/dish.type';
import { weatherT } from '../../weather/types/weather.type';

export type participantVoteT = {
  name: string;
  cravings: Partial<Record<CategoryEnum, CravingLevelEnum>>;
  style?: FoodStyleEnum | null;
};

export type categoryTotalsT = Record<CategoryEnum, number>;

export type styleTotalT = {
  votes: number;
  climatePoints: number;
  total: number;
};

export type styleTotalsT = Record<FoodStyleEnum, styleTotalT>;

export type scoreBreakdownT = {
  position: number;
  score: number;
  categoriesAverage: number;
  stylePoints: number;
};

export type scoredDishT = dishT & scoreBreakdownT;

export type rankedDishT = dishWithMediaT & scoreBreakdownT;

export type decisionT = {
  winner: rankedDishT;
  ranking: rankedDishT[];
  categoryTotals: categoryTotalsT;
  styleTotals: styleTotalsT;
  weather: weatherT | null;
  participantsCount: number;
  decidedAt: string;
};
