import { Injectable } from '@nestjs/common';
import { DISHES } from './data/dishes.data';
import { dishMediaT, dishT } from './types/dish.type';
import { WikipediaService } from './wikipedia.service';

const EMPTY_MEDIA: dishMediaT = {
  imageUrl: null,
  description: null,
  sourceUrl: null,
};

@Injectable()
export class DishesService {
  constructor(private readonly wikipediaService: WikipediaService) {}

  findAll(): dishT[] {
    return DISHES;
  }

  findAllWithMedia() {
    return this.withMedia(DISHES);
  }

  // Suma foto y descripción de Wikipedia; si no responde, el plato sale igual sin foto
  async withMedia<T extends dishT>(
    dishes: T[],
  ): Promise<(Omit<T, 'wikiTitle'> & dishMediaT)[]> {
    const titles = dishes
      .map((dish) => dish.wikiTitle)
      .filter((title): title is string => title !== null);

    const media = await this.wikipediaService.getMedia(titles);

    return dishes.map(({ wikiTitle, ...dish }) => ({
      ...dish,
      ...((wikiTitle && media.get(wikiTitle)) || EMPTY_MEDIA),
    }));
  }
}
