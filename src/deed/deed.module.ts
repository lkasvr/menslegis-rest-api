import { Module } from '@nestjs/common';
import { DeedService } from './deed.service';
import { DeedController } from './deed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deed } from './entities/deed.entity';
import { DeedType } from 'src/deed-type/entities/deed-type.entity';
import { DeedSubtype } from 'src/deed-subtype/entities/deed-subtype.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deed, DeedType, DeedSubtype])],
  controllers: [DeedController],
  providers: [DeedService],
})
export class DeedModule {}
