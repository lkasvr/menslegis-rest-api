import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { DEED_SUBTYPE } from '../entities/enums/deed_subtype.enum';
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';
import { Type } from 'class-transformer';
import { DeedType } from 'src/deed-type/entities/deed-type.entity';

export class FindOneOrCreateDeedSubtypeDto {
  @IsEnum(DEED_SUBTYPE)
  name: DEED_SUBTYPE;

  @IsOptional()
  @ValidateNested()
  @Type(() => PoliticalBody)
  politicalBody?: PoliticalBody;

  @IsOptional()
  @ValidateNested()
  @Type(() => DeedType)
  deedType: DeedType;
}
