import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Bike } from './bike.entity';
import { User } from '../users/user.entity';

@Entity()
export class BikeRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Bike, (bike) => bike.ratings)
  bike: Bike;

  @ManyToOne(() => User, (user) => user.ratings)
  user: User;

  @Column({ type: 'decimal', default: 1 })
  rating: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date | string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date | string;
}
