import { Injectable, Logger } from '@nestjs/common';
import { chunkArray, fetchJson } from '../common/utils/fetch-json';
import { dishMediaT } from './types/dish.type';
import { wikipediaQueryResponseT } from './types/wikipedia.type';

const WIKIPEDIA_API_URL = 'https://es.wikipedia.org/w/api.php';

const USER_AGENT = 'AntojoGourmet/1.0 (proyecto educativo de hackathon)';

// La API de extractos devuelve como máximo 20 páginas por pedido
const MAX_TITLES_PER_REQUEST = 20;

// Si Wikipedia falla o limita los pedidos, se deja de consultar durante este tiempo
const FAILURE_COOLDOWN_MS = 60_000;

@Injectable()
export class WikipediaService {
  private readonly logger = new Logger(WikipediaService.name);

  private readonly cache$ = new Map<string, dishMediaT>();

  private blockedUntil = 0;

  async getMedia(titles: string[]): Promise<Map<string, dishMediaT>> {
    const pending = [...new Set(titles)].filter(
      (title) => !this.cache$.has(title),
    );

    if (pending.length && Date.now() >= this.blockedUntil) {
      try {
        for (const chunk of chunkArray(pending, MAX_TITLES_PER_REQUEST)) {
          await this.fetchChunk(chunk);
        }
      } catch (error) {
        this.blockedUntil = Date.now() + FAILURE_COOLDOWN_MS;

        this.logger.warn(
          `Wikipedia no respondió, los platos salen sin foto: ${(error as Error).message}`,
        );
      }
    }

    const media = new Map<string, dishMediaT>();

    for (const title of titles) {
      const cached = this.cache$.get(title);

      if (cached) media.set(title, cached);
    }

    return media;
  }

  private async fetchChunk(titles: string[]) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      formatversion: '2',
      prop: 'pageimages|extracts|info',
      inprop: 'url',
      exintro: '1',
      explaintext: '1',
      exsentences: '2',
      exlimit: 'max',
      piprop: 'thumbnail',
      pithumbsize: '480',
      pilimit: 'max',
      redirects: '1',
      titles: titles.join('|'),
    });

    const data = await fetchJson<wikipediaQueryResponseT>(
      `${WIKIPEDIA_API_URL}?${params.toString()}`,
      { headers: { 'User-Agent': USER_AGENT } },
    );

    const pages = data.query?.pages ?? [];

    const pagesByTitle = new Map(pages.map((page) => [page.title, page]));

    const normalized = new Map(
      (data.query?.normalized ?? []).map(({ from, to }) => [from, to]),
    );

    const redirects = new Map(
      (data.query?.redirects ?? []).map(({ from, to }) => [from, to]),
    );

    for (const title of titles) {
      const normalizedTitle = normalized.get(title) ?? title;

      const finalTitle = redirects.get(normalizedTitle) ?? normalizedTitle;

      const page = pagesByTitle.get(finalTitle);

      this.cache$.set(title, {
        imageUrl: page?.thumbnail?.source ?? null,
        description: page?.extract?.trim() || null,
        sourceUrl: page && !page.missing ? (page.fullurl ?? null) : null,
      });
    }
  }
}
