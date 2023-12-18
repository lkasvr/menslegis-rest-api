import { Module } from '@nestjs/common';
import { PoliticalBodyService } from './political-body.service';
import { PoliticalBodyController } from './political-body.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoliticalBody } from './entities/political-body.entity';
import { FederatedEntitiesModule } from 'src/federated-entities/federated-entities.module';
import { PoliticalBodyRepository } from './political-body.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PoliticalBody]), FederatedEntitiesModule],
  controllers: [PoliticalBodyController],
  providers: [
    PoliticalBodyService,
    {
      provide: 'POLITICAL_BODY_REPOSITORY',
      useValue: PoliticalBodyRepository,
    },
  ],
})
export class PoliticalBodyModule {}
