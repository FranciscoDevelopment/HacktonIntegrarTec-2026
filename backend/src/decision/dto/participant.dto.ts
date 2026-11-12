import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { FoodStyleEnum } from '../../common/enums/food-style.enum';
import { CravingsDto } from './cravings.dto';

export class ParticipantDto {
  @IsString({ message: 'El nombre tiene que ser un texto' })
  @IsNotEmpty({ message: 'El nombre del comensal no puede ir vacío' })
  @MaxLength(30, { message: 'El nombre puede tener hasta 30 caracteres' })
  name!: string;

  @ValidateNested()
  @Type(() => CravingsDto)
  cravings!: CravingsDto;

  // Quien no eligió estilo no suma a ninguno
  @IsOptional()
  @IsEnum(FoodStyleEnum, {
    message: 'El estilo tiene que ser FITNESS o CONTUNDENTE',
  })
  style?: FoodStyleEnum | null;
}
