import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { DEED_TYPE } from '../entities/enums/deed_type.enum';
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';
import { Type } from 'class-transformer';

export class FindOneOrCreateDeedTypeDto {
  @IsEnum(DEED_TYPE)
  name: DEED_TYPE;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PoliticalBody)
  politicalBodies?: PoliticalBody[];
}
