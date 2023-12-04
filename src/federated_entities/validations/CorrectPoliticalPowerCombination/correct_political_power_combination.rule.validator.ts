import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { FEDERATED_LEVEL } from 'src/federated_entities/entities/enums/federated_level.enum';
import { POLITICAL_POWER } from 'src/federated_entities/entities/enums/political_power.enum';

@ValidatorConstraint({ name: 'CorrectFederativeUnitCombination', async: false })
@Injectable()
export class CorrectPoliticalPowerCombinationRule
  implements ValidatorConstraintInterface
{
  validate(value: POLITICAL_POWER, args: ValidationArguments) {
    if (
      value === POLITICAL_POWER.JUDICIARY &&
      args.object['level'] === FEDERATED_LEVEL.MUNICIPAL
    )
      return false;

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.value} cannot be a ${args.object['level']} power`;
  }
}
