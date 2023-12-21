import { IsString, IsUUID } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  name: string;

  @IsUUID('all')
  politicalBodyId: string;
}
