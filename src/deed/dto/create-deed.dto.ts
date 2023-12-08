export class CreateDeedDto {
  politicalBodyId: string;

  deedTypeName?: string;
  deedSubTypeName?: string;
  typeSlug?: string;

  deedName: string;
}
