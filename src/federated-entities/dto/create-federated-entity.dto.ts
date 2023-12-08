import { IsEnum } from 'class-validator';
import { FEDERATED_LEVEL } from '../entities/enums/federated_level.enum';
import { POLITICAL_POWER } from '../entities/enums/political_power.enum';
import { FEDERATIVE_UNIT } from '../entities/enums/federative_unit.enum';

export class CreateFederatedEntityDto {
  @IsEnum(FEDERATIVE_UNIT)
  name: FEDERATIVE_UNIT;

  @IsEnum(POLITICAL_POWER)
  political_power: POLITICAL_POWER;

  @IsEnum(FEDERATED_LEVEL)
  level: FEDERATED_LEVEL;
}
