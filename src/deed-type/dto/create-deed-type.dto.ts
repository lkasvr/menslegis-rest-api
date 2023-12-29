import { IsEnum, IsUUID } from 'class-validator';
import { DEED_TYPE } from '../entities/enums/deed_type.enum';

export class CreateDeedTypeDto {
  @IsEnum(DEED_TYPE)
  name: DEED_TYPE;

  @IsUUID('all', { each: true })
  politicalBodiesId: string[];
}
