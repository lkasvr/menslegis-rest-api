import { Module } from '@nestjs/common';
import { DeedSubtypeService } from './deed-subtype.service';
import { DeedSubtypeController } from './deed-subtype.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeedSubtype } from './entities/deed-subtype.entity';
import { PoliticalBodyModule } from 'src/political-body/political-body.module';
import { DeedTypeModule } from 'src/deed-type/deed-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeedSubtype]),
    PoliticalBodyModule,
    DeedTypeModule,
  ],
  controllers: [DeedSubtypeController],
  providers: [DeedSubtypeService],
})
export class DeedSubtypeModule {}
