import { Author } from 'src/author/entities/author.entity';
import { DeedSubtype } from 'src/deed-subtype/entities/deed-subtype.entity';
import { DeedType } from 'src/deed-type/entities/deed-type.entity';
import { Deed } from 'src/deed/entities/deed.entity';
import { FederatedEntity } from 'src/federated-entities/entities/federated-entities.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique(['name'])
@Unique(['name', 'federatedEntity'])
@Entity()
export class PoliticalBody {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 105 })
  name: string;

  @ManyToOne(
    () => FederatedEntity,
    (federatedEntity) => federatedEntity.politicalBodies,
    { nullable: false, onDelete: 'CASCADE' },
  )
  federatedEntity: FederatedEntity;

  @ManyToMany(() => DeedType, (deedType) => deedType.politicalBodies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'political_body_deed_type' })
  deedTypes: DeedType[];

  @OneToMany(() => DeedSubtype, (deedSubtype) => deedSubtype.politicalBody, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  deedSubtypes: DeedSubtype[];

  @OneToMany(() => Deed, (deed) => deed.politicalBody, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  deeds: Deed[];

  @OneToMany(() => Author, (author) => author.politicalBody, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  authors: Author[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: string;

  @DeleteDateColumn({
    type: 'time with time zone',
    nullable: true,
    select: false,
  })
  deletedAt: Date;
}
