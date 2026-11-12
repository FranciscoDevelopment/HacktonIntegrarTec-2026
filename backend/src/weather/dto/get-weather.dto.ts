import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsOptional } from 'class-validator';

export class GetWeatherDto {
  @IsOptional()
  @Type(() => Number)
  @IsLatitude({ message: 'La latitud no es válida' })
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsLongitude({ message: 'La longitud no es válida' })
  longitude?: number;
}
