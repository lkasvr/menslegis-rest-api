import { IsUUID } from 'class-validator';

export class CreateDeedDto {
  name: string;

  @IsUUID()
  politicalBodyId?: string;

  @IsUUID()
  deedTypeId?: string;

  @IsUUID()
  deedSubtypeId?: string;

  @IsUUID()
  authorId?: string;
}
