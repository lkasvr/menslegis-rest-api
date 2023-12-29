import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

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

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsUUID('all', { each: true })
  authorsIds: string[];

  @IsUUID()
  deedTypeId: string;

  @IsUUID()
  deedSubtypeId: string;
}
