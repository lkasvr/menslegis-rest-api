import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { FEDERATED_LEVEL } from 'src/federated_entities/entities/enums/federated_level.enum';
import { FEDERATIVE_UNIT } from 'src/federated_entities/entities/enums/federative_unit.enum';

@ValidatorConstraint({ name: 'CorrectFederativeUnitCombination', async: false })
@Injectable()
export class CorrectFederativeUnitCombinationRule
  implements ValidatorConstraintInterface
{
  validate(value: FEDERATIVE_UNIT, args: ValidationArguments) {
    if (
      value === FEDERATIVE_UNIT.UNIAO &&
      args.object['level'] !== FEDERATED_LEVEL.FEDERAL
    )
      return false;

    if (value.length === 2 && args.object['level'] !== FEDERATED_LEVEL.STATE)
      return false;

    if (
      value.length > 2 &&
      value !== FEDERATIVE_UNIT.UNIAO &&
      args.object['level'] !== FEDERATED_LEVEL.MUNICIPAL
    )
      return false;

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.value} cannot be a ${args.object['level']} member`;
  }
}
