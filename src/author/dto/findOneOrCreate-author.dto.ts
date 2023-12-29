import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FindOneOrCreateAuthorDto {
  @IsUUID('all')
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID('all')
  @IsOptional()
  politicalBodyId?: string;
}
