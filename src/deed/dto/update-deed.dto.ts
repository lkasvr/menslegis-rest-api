import { PartialType } from '@nestjs/swagger';
import { CreateDeedDto } from './create-deed.dto';

export class UpdateDeedDto extends PartialType(CreateDeedDto) {}
