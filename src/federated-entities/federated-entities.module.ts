import { Module } from '@nestjs/common';
import { FederatedEntitiesService } from './federated-entities.service';
import { FederatedEntitiesController } from './federated-entities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FederatedEntity } from './entities//federated-entities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FederatedEntity])],
  controllers: [FederatedEntitiesController],
  providers: [FederatedEntitiesService],
  exports: [FederatedEntitiesService],
})
export class FederatedEntitiesModule {}
