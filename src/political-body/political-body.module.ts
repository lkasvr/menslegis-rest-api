import { Module } from '@nestjs/common';
import { PoliticalBodyService } from './political-body.service';
import { PoliticalBodyController } from './political-body.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoliticalBody } from './entities/political-body.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoliticalBody])],
  controllers: [PoliticalBodyController],
  providers: [PoliticalBodyService],
})
export class PoliticalBodyModule {}
