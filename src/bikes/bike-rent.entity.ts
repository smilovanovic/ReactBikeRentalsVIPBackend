import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Bike } from './bike.entity';
import { User } from '../users/user.entity';

@Entity()
export class BikeRent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Bike, (bike) => bike.rents)
  bike: Bike;

  @ManyToOne(() => User, (user) => user.rents)
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  from: Date | string;

  @CreateDateColumn({ type: 'timestamptz' })
  to: Date | string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date | string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date | string;
}
