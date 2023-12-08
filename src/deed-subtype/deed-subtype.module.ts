import { Module } from '@nestjs/common';
import { DeedSubtypeService } from './deed-subtype.service';
import { DeedSubtypeController } from './deed-subtype.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeedSubtype } from './entities/deed-subtype.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeedSubtype])],
  controllers: [DeedSubtypeController],
  providers: [DeedSubtypeService],
})
export class DeedSubtypeModule {}
