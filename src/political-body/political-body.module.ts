import { Module } from '@nestjs/common';

import { PoliticalBodyController } from './political-body.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoliticalBody } from './entities/political-body.entity';
import { FederatedEntitiesModule } from 'src/federated-entities/federated-entities.module';
import { PoliticalBodyService } from './political-body.service';

@Module({
  imports: [TypeOrmModule.forFeature([PoliticalBody]), FederatedEntitiesModule],
  controllers: [PoliticalBodyController],
  providers: [PoliticalBodyService],
  exports: [PoliticalBodyService],
})
export class PoliticalBodyModule {}
