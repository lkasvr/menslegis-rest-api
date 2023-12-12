import { IsString, IsUUID } from 'class-validator';

export class CreatePoliticalBodyDto {
  @IsString()
  name: string;

  @IsUUID()
  federatedEntityId: string;
}
