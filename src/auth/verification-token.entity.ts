import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum VerificationTokenTypes {
  EMAIL = 'email',
  RESET_PASSWORD = 'reset_password',
}

const MIN = 100000;
const MAX = 1000000;

@Entity()
export class VerificationToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne((type) => User)
  user: Promise<User>;

  @Column({
    type: 'enum',
    enum: VerificationTokenTypes,
    default: [VerificationTokenTypes.EMAIL],
  })
  type: VerificationTokenTypes;

  @Column({ default: false })
  isUsed: boolean;

  @Column()
  token: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date | string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date | string;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP + (20 ||' minutes')::interval",
  })
  expiresAt: Date | string;

  @BeforeInsert()
  generateToken() {
    this.token = Math.ceil(Math.random() * (MAX - MIN) + MIN).toString();
  }
}
