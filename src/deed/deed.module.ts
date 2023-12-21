import { Module } from '@nestjs/common';
import { DeedService } from './deed.service';
import { DeedController } from './deed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deed } from './entities/deed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deed])],
  controllers: [DeedController],
  providers: [DeedService],
})
export class DeedModule {}
