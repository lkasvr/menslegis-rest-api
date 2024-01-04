import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  name: string;

  @IsUUID('all')
  politicalBodyId: string;
}
