import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FederatedEntitiesModule } from './federated-entities/federated-entities.module';
import { PoliticalBodyModule } from './political-body/political-body.module';
import { DeedModule } from './deed/deed.module';
import { AuthorModule } from './author/author.module';
import { DeedTypeModule } from './deed-type/deed-type.module';
import { DeedSubtypeModule } from './deed-subtype/deed-subtype.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
      logging: true,
      autoLoadEntities: true,
      cache: {
        duration: 5000,
      },
    }),
    FederatedEntitiesModule,
    PoliticalBodyModule,
    DeedModule,
    AuthorModule,
    DeedTypeModule,
    DeedSubtypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
