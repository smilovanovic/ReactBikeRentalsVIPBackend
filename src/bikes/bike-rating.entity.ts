import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Bike } from './bike.entity';

@Entity()
export class BikeRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Bike, (user) => user.ratings)
  bike: Bike;

  @Column({ default: 0 })
  rating: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date | string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date | string;
}
