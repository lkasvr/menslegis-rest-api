import { IsUUID } from 'class-validator';

export class CreateDeedDto {
  name: string;

  @IsUUID()
  politicalBodyId: string;

  @IsUUID('all', { each: true })
  authorsIds: string[];

  @IsUUID()
  deedTypeId: string;

  @IsUUID()
  deedSubtypeId: string;
}
