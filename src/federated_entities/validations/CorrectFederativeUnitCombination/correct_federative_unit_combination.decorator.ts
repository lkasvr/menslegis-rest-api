import { ValidationOptions, registerDecorator } from 'class-validator';
import { CorrectFederativeUnitCombinationRule } from './correct_federative_unit_combination.rule.validator';

export function CorrectFederativeUnitCombination(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'CorrectFederativeUnitCombination',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CorrectFederativeUnitCombinationRule,
    });
  };
}
