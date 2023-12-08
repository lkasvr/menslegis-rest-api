import { PartialType } from '@nestjs/swagger';
import { CreateDeedSubtypeDto } from './create-deed-subtype.dto';

export class UpdateDeedSubtypeDto extends PartialType(CreateDeedSubtypeDto) {}
