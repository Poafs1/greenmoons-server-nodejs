import { BaseAuditableEntity } from '../../sql/entities/baseAuditable.entity';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'user' })
export class UserEntity extends BaseAuditableEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  password: string;

  constructor() {
    super();
    this.id = uuid();
  }
}
