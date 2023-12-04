import { IsEnum } from 'class-validator';
import { FEDERATED_LEVEL } from '../entities/enums/federated_level.enum';
import { POLITICAL_POWER } from '../entities/enums/political_power.enum';
import { FEDERATIVE_UNIT } from '../entities/enums/federative_unit.enum';
import { CorrectFederativeUnitCombination } from '../validations/CorrectFederativeUnitCombination/correct_federative_unit_combination.decorator';
import { CorrectPoliticalPowerCombination } from '../validations/CorrectPoliticalPowerCombination/correct_political_power_combination.decorator';
import { FederatedEntityExists } from '../validations/dataBaseBased/FederatedEntityExists/federated_entity_exists.decorator';

export class CreateFederatedEntityDto {
  @FederatedEntityExists()
  @CorrectFederativeUnitCombination()
  @IsEnum(FEDERATIVE_UNIT)
  name: FEDERATIVE_UNIT;

  @CorrectPoliticalPowerCombination()
  @IsEnum(POLITICAL_POWER)
  political_power: POLITICAL_POWER;

  @IsEnum(FEDERATED_LEVEL)
  level: FEDERATED_LEVEL;
}
