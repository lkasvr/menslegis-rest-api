import { Module } from '@nestjs/common';
import { FederatedEntitiesService } from './federated_entities.service';
import { FederatedEntitiesController } from './federated_entities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FederatedEntity } from './entities/federated_entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FederatedEntity])],
  controllers: [FederatedEntitiesController],
  providers: [FederatedEntitiesService],
})
export class FederatedEntitiesModule {}
