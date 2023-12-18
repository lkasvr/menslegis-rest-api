import { Repository } from 'typeorm';
import { PoliticalBody } from './entities/political-body.entity';

export class PoliticalBodyRepository extends Repository<PoliticalBody> {
  findWithoutSoftDeletedFederatedEntity() {
    return this.createQueryBuilder('politicalBody')
      .leftJoin('politicalBody.federatedEntity', 'federatedEntity')
      .where('federatedEntity.deletedAt IS NULL')
      .getMany();
  }
}
