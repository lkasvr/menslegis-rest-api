import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';

export class FindOneOrCreateAuthorDto {
  @IsUUID('all')
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PoliticalBody)
  politicalBody?: PoliticalBody;
}
