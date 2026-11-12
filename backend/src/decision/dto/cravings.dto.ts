import { IsEnum, IsOptional } from 'class-validator';
import { CravingLevelEnum } from '../../common/enums/craving-level.enum';

const message = 'Las ganas tienen que ser POCAS, MEDIAS o MUCHAS';

// Cada categoría es opcional: lo que no se manda cuenta como "medias"
export class CravingsDto {
  @IsOptional()
  @IsEnum(CravingLevelEnum, { message })
  SALADO?: CravingLevelEnum;

  @IsOptional()
  @IsEnum(CravingLevelEnum, { message })
  DULCE?: CravingLevelEnum;

  @IsOptional()
  @IsEnum(CravingLevelEnum, { message })
  VEGETARIANO?: CravingLevelEnum;

  @IsOptional()
  @IsEnum(CravingLevelEnum, { message })
  VEGANO?: CravingLevelEnum;

  @IsOptional()
  @IsEnum(CravingLevelEnum, { message })
  CARNIVORO?: CravingLevelEnum;

  @IsOptional()
  @IsEnum(CravingLevelEnum, { message })
  HARINAS?: CravingLevelEnum;
}
