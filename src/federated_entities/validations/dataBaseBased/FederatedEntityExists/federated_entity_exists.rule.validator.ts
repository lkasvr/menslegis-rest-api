import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { FEDERATIVE_UNIT } from 'src/federated_entities/entities/enums/federative_unit.enum';
import { FederatedEntity } from 'src/federated_entities/entities/federated_entity.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ name: 'CorrectFederativeUnitCombination', async: true })
@Injectable()
export class FederatedEntityExistsRule implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(FederatedEntity)
    private readonly federatedEntityRepository: Repository<FederatedEntity>,
  ) {}

  async validate(value: FEDERATIVE_UNIT, args: ValidationArguments) {
    try {
      await this.federatedEntityRepository.findOneByOrFail({
        name: value,
        level: args.object['level'],
        political_power: args.object['political_power'],
      });
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.object['political_power']} ${args.object['level']} Power of ${args.value} already exist`;
  }
}
