import { PartialType } from '@nestjs/mapped-types';
import { CreateFederatedEntityDto } from './create-federated-entity.dto';
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';

export class UpdateFederatedEntityDto extends PartialType(
  CreateFederatedEntityDto,
) {
  readonly politicalBodiesId?: string[];
  readonly politicalBodies?: PoliticalBody[];
}
