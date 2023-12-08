import { PartialType } from '@nestjs/swagger';
import { CreateDeedTypeDto } from './create-deed-type.dto';

export class UpdateDeedTypeDto extends PartialType(CreateDeedTypeDto) {}
