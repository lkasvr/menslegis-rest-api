import { Module } from '@nestjs/common';
import { DeedTypeService } from './deed-type.service';
import { DeedTypeController } from './deed-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeedType } from './entities/deed-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeedType])],
  controllers: [DeedTypeController],
  providers: [DeedTypeService],
})
export class DeedTypeModule {}
