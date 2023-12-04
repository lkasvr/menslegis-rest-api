import { ValidationOptions, registerDecorator } from 'class-validator';
import { FederatedEntityExistsRule } from './federated_entity_exists.rule.validator';

export function FederatedEntityExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'CorrectPoliticalPowerCombination',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: FederatedEntityExistsRule,
    });
  };
}
