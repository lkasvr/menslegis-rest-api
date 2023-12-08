import { PartialType } from '@nestjs/swagger';
import { CreatePoliticalBodyDto } from './create-political-body.dto';

export class UpdatePoliticalBodyDto extends PartialType(CreatePoliticalBodyDto) {}
