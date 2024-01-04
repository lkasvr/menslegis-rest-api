import { IsString, IsUUID, IsUrl } from 'class-validator';

export class UpdateDeedDto {
  isToAddAuthors?: boolean;

  @IsString()
  name?: string;

  @IsString()
  description?: string;

  @IsString()
  status?: string;

  @IsUrl()
  pageDocLink?: string;

  @IsUrl()
  docLink?: string;

  @IsString()
  docDate?: string;

  @IsUUID('all', { each: true })
  authorsIds?: string[];

  @IsUUID()
  deedTypeId?: string;

  @IsUUID()
  deedSubtypeId?: string;
}
