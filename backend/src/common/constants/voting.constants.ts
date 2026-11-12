import { CravingLevelEnum } from '../enums/craving-level.enum';

export const MIN_PARTICIPANTS = 5;

export const MAX_PARTICIPANTS = 6;

export const CRAVING_POINTS: Record<CravingLevelEnum, number> = {
  [CravingLevelEnum.POCAS]: 1,
  [CravingLevelEnum.MEDIAS]: 2,
  [CravingLevelEnum.MUCHAS]: 3,
} as const;

// Lo que nadie tocó cuenta como "medias"
export const DEFAULT_CRAVING = CravingLevelEnum.MEDIAS;

export const STYLE_VOTE_POINTS = 1;
