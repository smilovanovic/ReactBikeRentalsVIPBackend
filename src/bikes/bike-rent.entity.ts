import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { Bike } from './bike.entity';
import { User } from '../users/user.entity';

@Entity()
export class BikeRent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Bike, (bike) => bike.rents)
  bike: Bike;

  @Column()
  bikeId: string;

  @ManyToOne(() => User, (user) => user.rents)
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  from: Date | string;

  @CreateDateColumn({ type: 'timestamptz' })
  to: Date | string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date | string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date | string;
}
