import { CategoryEnum } from '../../common/enums/category.enum';
import { CravingLevelEnum } from '../../common/enums/craving-level.enum';
import { FoodStyleEnum } from '../../common/enums/food-style.enum';
import { dishT } from '../../dishes/types/dish.type';
import { calculateClimateBonus } from '../../weather/utils/climate-bonus';
import { participantVoteT } from '../types/decision.type';
import { rankDishes, sumCategoryTotals, sumStyleTotals } from './scoring';

const { SALADO, DULCE, CARNIVORO, VEGETARIANO } = CategoryEnum;
const { POCAS, MUCHAS } = CravingLevelEnum;
const { FITNESS, CONTUNDENTE } = FoodStyleEnum;

const participant = (
  cravings: participantVoteT['cravings'],
  style: FoodStyleEnum | null = null,
): participantVoteT => ({ name: 'Comensal', cravings, style });

describe('calculateClimateBonus', () => {
  it.each([
    [8, CONTUNDENTE, 1],
    [16, CONTUNDENTE, 0.4],
    [26, FITNESS, 0.6],
    [40, FITNESS, 1],
  ])('a %s °C suma a %s %s punto', (temperature, style, points) => {
    expect(calculateClimateBonus(temperature)).toEqual({ style, points });
  });

  it('a 20 °C el clima no opina', () => {
    expect(calculateClimateBonus(20)).toEqual({ style: null, points: 0 });
  });
});

describe('sumCategoryTotals', () => {
  it('suma pocas = 1, medias = 2, muchas = 3 y lo que nadie tocó cuenta como medias', () => {
    const totals = sumCategoryTotals([
      participant({ SALADO: MUCHAS, DULCE: POCAS }),
      participant({ SALADO: MUCHAS }),
    ]);

    expect(totals[SALADO]).toBe(6);
    expect(totals[DULCE]).toBe(3);
    expect(totals[CARNIVORO]).toBe(4);
  });
});

describe('sumStyleTotals', () => {
  it('cuenta un punto por voto, suma el clima y quien no eligió no suma', () => {
    const totals = sumStyleTotals(
      [
        participant({}, FITNESS),
        participant({}, CONTUNDENTE),
        participant({}, null),
      ],
      { style: CONTUNDENTE, points: 0.4 },
    );

    expect(totals[FITNESS]).toEqual({
      votes: 1,
      climatePoints: 0,
      total: 1,
    });
    expect(totals[CONTUNDENTE]).toEqual({
      votes: 1,
      climatePoints: 0.4,
      total: 1.4,
    });
  });
});

describe('rankDishes', () => {
  const dishes: dishT[] = [
    {
      id: 'ensalada',
      name: 'Ensalada',
      emoji: '🥗',
      categories: [SALADO, VEGETARIANO],
      style: FITNESS,
      wikiTitle: null,
    },
    {
      id: 'milanesa',
      name: 'Milanesa',
      emoji: '🥩',
      categories: [SALADO, CARNIVORO],
      style: CONTUNDENTE,
      wikiTitle: null,
    },
  ];

  it('ordena por promedio de categorías más puntos de estilo', () => {
    const participants = [
      participant({ CARNIVORO: MUCHAS, VEGETARIANO: POCAS }, CONTUNDENTE),
      participant({ CARNIVORO: MUCHAS, VEGETARIANO: POCAS }, FITNESS),
    ];

    const ranking = rankDishes(
      dishes,
      sumCategoryTotals(participants),
      sumStyleTotals(participants, calculateClimateBonus(8)),
    );

    expect(ranking.map((dish) => dish.id)).toEqual(['milanesa', 'ensalada']);
    expect(ranking[0]).toMatchObject({
      position: 1,
      categoriesAverage: 5,
      stylePoints: 2,
      score: 7,
    });
  });
});
