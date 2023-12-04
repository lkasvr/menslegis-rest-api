import { ValidationOptions, registerDecorator } from 'class-validator';
import { CorrectPoliticalPowerCombinationRule } from './correct_political_power_combination.rule.validator';

export function CorrectPoliticalPowerCombination(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'CorrectPoliticalPowerCombination',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CorrectPoliticalPowerCombinationRule,
    });
  };
}
