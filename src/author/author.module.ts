import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { PoliticalBodyModule } from 'src/political-body/political-body.module';

@Module({
  imports: [TypeOrmModule.forFeature([Author]), PoliticalBodyModule],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
