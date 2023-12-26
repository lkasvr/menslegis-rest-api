import { IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateDeedDto {
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsString()
  status?: string;

  @IsUrl()
  docLink?: string;

  @IsString()
  docDate?: string;

  @IsUUID()
  politicalBodyId: string;

  @IsUUID('all', { each: true })
  authorsIds: string[];

  @IsUUID()
  deedTypeId: string;

  @IsUUID()
  deedSubtypeId: string;
}
