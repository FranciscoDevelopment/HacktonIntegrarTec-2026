import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { fetchJson } from '../common/utils/fetch-json';
import { roundTo } from '../common/utils/round';
import { openMeteoCurrentResponseT, weatherT } from './types/weather.type';
import { calculateClimateBonus } from './utils/climate-bonus';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

// Si el navegador no comparte la ubicación, se usa Buenos Aires
const DEFAULT_LOCATION = {
  latitude: -34.6037,
  longitude: -58.3816,
  label: 'Buenos Aires',
} as const;

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  async getCurrent(latitude?: number, longitude?: number): Promise<weatherT> {
    const hasLocation = latitude !== undefined && longitude !== undefined;

    // Con dos decimales (~1 km) alcanza para el clima y no se manda la ubicación exacta
    const lat = hasLocation ? roundTo(latitude) : DEFAULT_LOCATION.latitude;

    const lon = hasLocation ? roundTo(longitude) : DEFAULT_LOCATION.longitude;

    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: 'temperature_2m',
      timezone: 'auto',
    });

    try {
      const data = await fetchJson<openMeteoCurrentResponseT>(
        `${OPEN_METEO_URL}?${params.toString()}`,
      );

      const temperature = data.current.temperature_2m;

      return {
        temperature,
        latitude: lat,
        longitude: lon,
        locationLabel: hasLocation ? 'Tu ubicación' : DEFAULT_LOCATION.label,
        isDefaultLocation: !hasLocation,
        observedAt: data.current.time,
        climateBonus: calculateClimateBonus(temperature),
      };
    } catch (error) {
      this.logger.error(
        `No se pudo consultar Open-Meteo: ${(error as Error).message}`,
      );

      throw new ServiceUnavailableException(
        'No se pudo consultar el clima en este momento',
      );
    }
  }
}
