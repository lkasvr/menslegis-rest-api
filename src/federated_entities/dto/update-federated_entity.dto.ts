import { PartialType } from '@nestjs/mapped-types';
import { CreateFederatedEntityDto } from './create-federated_entity.dto';

export class UpdateFederatedEntityDto extends PartialType(
  CreateFederatedEntityDto,
) {}
