import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
} from '../../common/constants/voting.constants';
import { ParticipantDto } from './participant.dto';

export class CreateDecisionDto {
  @IsArray({ message: 'Los comensales tienen que ser una lista' })
  @ArrayMinSize(MIN_PARTICIPANTS, {
    message: `Tienen que votar al menos ${MIN_PARTICIPANTS} comensales`,
  })
  @ArrayMaxSize(MAX_PARTICIPANTS, {
    message: `Pueden votar como máximo ${MAX_PARTICIPANTS} comensales`,
  })
  @ValidateNested({ each: true })
  @Type(() => ParticipantDto)
  participants!: ParticipantDto[];

  @IsOptional()
  @IsLatitude({ message: 'La latitud no es válida' })
  latitude?: number;

  @IsOptional()
  @IsLongitude({ message: 'La longitud no es válida' })
  longitude?: number;
}
