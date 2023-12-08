import { Author } from 'src/author/entities/author.entity';
import { DeedSubtype } from 'src/deed-subtype/entities/deed-subtype.entity';
import { DeedType } from 'src/deed-type/entities/deed-type.entity';
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Deed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 105 })
  name: string;

  @ManyToOne(() => PoliticalBody, (politicalBody) => politicalBody.deed)
  politicalBody: PoliticalBody;

  @ManyToOne(() => DeedType, (deedType) => deedType.deeds)
  deedType: DeedType;

  @ManyToOne(() => DeedSubtype, (deedSubtype) => deedSubtype.deeds)
  deedSubtype: DeedSubtype;

  @ManyToOne(() => Author, (author) => author.deeds)
  author: Author;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: string;
}
