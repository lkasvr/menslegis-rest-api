import { Author } from 'src/author/entities/author.entity';
import { DeedSubtype } from 'src/deed-subtype/entities/deed-subtype.entity';
import { DeedType } from 'src/deed-type/entities/deed-type.entity';
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique(['name'])
@Unique(['name', 'deedType', 'deedSubtype'])
@Entity()
export class Deed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  pageDocLink: string;

  @Column({ type: 'varchar', nullable: true })
  docLink: string;

  @Column({ type: 'date', nullable: true })
  docDate?: Date;

  @ManyToOne(() => PoliticalBody, (politicalBody) => politicalBody.deeds)
  politicalBody: PoliticalBody;

  @ManyToOne(() => DeedType, (deedType) => deedType.deeds, {
    nullable: true,
  })
  deedType: DeedType;

  @ManyToOne(() => DeedSubtype, (deedSubtype) => deedSubtype.deeds, {
    nullable: true,
  })
  deedSubtype: DeedSubtype;

  @ManyToMany(() => Author, (authors) => authors.deeds, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable({ name: 'author_deed' })
  authors: Author[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: string;
}
