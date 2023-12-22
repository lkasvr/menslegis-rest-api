import { Module } from '@nestjs/common';
import { DeedService } from './deed.service';
import { DeedController } from './deed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deed } from './entities/deed.entity';
import { AuthorModule } from 'src/author/author.module';
import { PoliticalBodyModule } from 'src/political-body/political-body.module';
import { DeedTypeModule } from 'src/deed-type/deed-type.module';
import { DeedSubtypeModule } from 'src/deed-subtype/deed-subtype.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deed]),
    PoliticalBodyModule,
    AuthorModule,
    DeedTypeModule,
    DeedSubtypeModule,
  ],
  controllers: [DeedController],
  providers: [DeedService],
})
export class DeedModule {}
