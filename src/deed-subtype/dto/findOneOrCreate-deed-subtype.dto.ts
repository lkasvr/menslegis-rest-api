import { IsEnum, IsUUID } from 'class-validator';
import { DEED_SUBTYPE } from '../entities/enums/deed_subtype.enum';

export class FindOneOrCreateDeedSubtypeDto {
  @IsEnum(DEED_SUBTYPE)
  name: DEED_SUBTYPE;

  @IsUUID('all')
  politicalBodyId?: string;

  @IsUUID('all')
  deedTypeId?: string;
}
