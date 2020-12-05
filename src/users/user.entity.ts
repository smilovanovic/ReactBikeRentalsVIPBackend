import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  MANAGER = 'manager',
  CLIENT = 'client',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column({
    array: true,
    type: 'enum',
    enum: UserRole,
    default: [UserRole.CLIENT],
  })
  roles: UserRole[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date | string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date | string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await this.getHashedPassword();
  }

  getHashedPassword() {
    return bcrypt.hash(this.password, 10);
  }

  isPasswordValid(pass: string) {
    return bcrypt.compare(pass, this.password);
  }

  isManager() {
    return this.roles.includes(UserRole.MANAGER);
  }

  isClient() {
    return this.roles.includes(UserRole.CLIENT);
  }
}
