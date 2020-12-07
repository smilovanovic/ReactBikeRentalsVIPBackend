import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { BikeRating } from './bike-rating.entity';

@Entity()
export class Bike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column()
  location: string;

  @Column({ default: 0 })
  rating: number;

  @OneToMany(() => BikeRating, (rating) => rating.bike)
  ratings: BikeRating[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date | string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date | string;

  @BeforeInsert()
  async allToLowerCase() {
    this.model = this.model.toLowerCase();
    this.color = this.color.toLowerCase();
    this.location = this.location.toLowerCase();
  }
}
