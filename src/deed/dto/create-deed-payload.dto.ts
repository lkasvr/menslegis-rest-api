import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsString,
  IsUrl,
} from 'class-validator';
import { DEED_SUBTYPE } from 'src/deed-subtype/entities/enums/deed_subtype.enum';
import { DEED_TYPE } from 'src/deed-type/entities/enums/deed_type.enum';

export class DeedPayloadDto {
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

  @IsString()
  politicalBodyName: string;

  @IsEnum(DEED_TYPE)
  deedTypeName: DEED_TYPE;

  @IsEnum(DEED_SUBTYPE)
  deedSubtypeName: DEED_SUBTYPE;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  authorsName: string[];
}
