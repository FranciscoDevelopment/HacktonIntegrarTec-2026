import {
  CRAVING_POINTS,
  DEFAULT_CRAVING,
  STYLE_VOTE_POINTS,
} from '../../common/constants/voting.constants';
import { CategoryEnum } from '../../common/enums/category.enum';
import { FoodStyleEnum } from '../../common/enums/food-style.enum';
import { roundTo } from '../../common/utils/round';
import { dishT } from '../../dishes/types/dish.type';
import { climateBonusT } from '../../weather/types/weather.type';
import {
  categoryTotalsT,
  participantVoteT,
  scoredDishT,
  styleTotalsT,
} from '../types/decision.type';

const CATEGORIES = Object.values(CategoryEnum);

// 1. Ganas por categoría: pocas = 1, medias = 2, muchas = 3, sumado entre todos
export function sumCategoryTotals(
  participants: participantVoteT[],
): categoryTotalsT {
  const totals = Object.fromEntries(
    CATEGORIES.map((category) => [category, 0]),
  ) as categoryTotalsT;

  for (const participant of participants) {
    for (const category of CATEGORIES) {
      const level = participant.cravings[category] ?? DEFAULT_CRAVING;

      totals[category] += CRAVING_POINTS[level];
    }
  }

  return totals;
}

// 2 y 4. Fitness o contundente: 1 punto por voto, más el voto del clima
export function sumStyleTotals(
  participants: participantVoteT[],
  climateBonus: climateBonusT | null,
): styleTotalsT {
  const totals = {} as styleTotalsT;

  for (const style of Object.values(FoodStyleEnum)) {
    const votes = participants.filter(
      (participant) => participant.style === style,
    ).length;

    const climatePoints =
      climateBonus?.style === style ? climateBonus.points : 0;

    totals[style] = {
      votes,
      climatePoints,
      total: roundTo(votes * STYLE_VOTE_POINTS + climatePoints),
    };
  }

  return totals;
}

// 5. Ranking: promedio de las categorías del plato + puntos de su estilo
export function rankDishes(
  dishes: dishT[],
  categoryTotals: categoryTotalsT,
  styleTotals: styleTotalsT,
): scoredDishT[] {
  return dishes
    .map((dish) => {
      const categoriesSum = dish.categories.reduce(
        (sum, category) => sum + categoryTotals[category],
        0,
      );

      const categoriesAverage = roundTo(categoriesSum / dish.categories.length);

      const stylePoints = styleTotals[dish.style].total;

      return {
        ...dish,
        position: 0,
        score: roundTo(categoriesAverage + stylePoints),
        categoriesAverage,
        stylePoints,
      };
    })
    .sort(
      (first, second) =>
        second.score - first.score ||
        first.name.localeCompare(second.name, 'es'),
    )
    .map((dish, index) => ({ ...dish, position: index + 1 }));
}
