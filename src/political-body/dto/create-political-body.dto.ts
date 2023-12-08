import { IsString } from 'class-validator';

export class CreatePoliticalBodyDto {
  @IsString()
  name: string;
}
