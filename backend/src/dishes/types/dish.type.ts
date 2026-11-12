import { CategoryEnum } from '../../common/enums/category.enum';
import { FoodStyleEnum } from '../../common/enums/food-style.enum';

export type dishT = {
  id: string;
  name: string;
  emoji: string;
  categories: CategoryEnum[];
  style: FoodStyleEnum;
  wikiTitle: string | null;
};

export type dishMediaT = {
  imageUrl: string | null;
  description: string | null;
  sourceUrl: string | null;
};

export type dishWithMediaT = Omit<dishT, 'wikiTitle'> & dishMediaT;
