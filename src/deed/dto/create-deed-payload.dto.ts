import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { DEED_SUBTYPE } from 'src/deed-subtype/entities/enums/deed_subtype.enum';
import { DEED_TYPE } from 'src/deed-type/entities/enums/deed_type.enum';

export class DeedPayloadDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsUrl()
  @IsOptional()
  docLink?: string;

  @IsString()
  docDate: string;

  @IsUUID()
  @IsOptional()
  politicalBodyId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  politicalBodyName?: string;

  @IsEnum(DEED_TYPE)
  type: DEED_TYPE;

  @IsEnum(DEED_SUBTYPE)
  subtype: DEED_SUBTYPE;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsNotEmpty()
  authors: Authors[];
}

class Authors {
  @IsUUID()
  id: string;

  @IsString()
  name: string;
}
