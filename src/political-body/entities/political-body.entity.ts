import { Author } from 'src/author/entities/author.entity';
import { DeedType } from 'src/deed-type/entities/deed-type.entity';
import { Deed } from 'src/deed/entities/deed.entity';
import { FederatedEntity } from 'src/federated-entities/entities/federated-entities.entity';
import {
  Column,
  CreateDateColumn,
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
@Entity()
export class PoliticalBody {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 105 })
  name: string;

  @ManyToOne(
    () => FederatedEntity,
    (federatedEntity) => federatedEntity.politicalBodies,
  )
  federatedEntity: FederatedEntity;

  @ManyToMany(() => DeedType, (deedType) => deedType.politicalBodies)
  @JoinTable()
  deedTypes: DeedType[];

  @OneToMany(() => Deed, (deed) => deed.politicalBody)
  deed: Deed[];

  @OneToMany(() => Author, (author) => author.politicalBody)
  authors: Author[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: string;
}
