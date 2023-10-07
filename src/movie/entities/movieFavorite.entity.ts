import { UserEntity } from 'src/users/entities/user.entity';
import { BaseAuditableEntity } from '../../sql/entities/baseAuditable.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'movie_favorite' })
export class MovieFavoriteEntity extends BaseAuditableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  movie_id: number;

  @Column()
  @Index()
  user_id: string;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  is_favorite: boolean;
}
