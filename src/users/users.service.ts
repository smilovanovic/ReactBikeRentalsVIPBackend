import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { EntityManager } from 'typeorm';

@Injectable()
export class UsersService {
  private defaultConditions: FindConditions<User> = { isActive: true };
  constructor(private userRepository: UserRepository) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ ...this.defaultConditions, email });
  }

  async create(
    createUserDto: CreateUserDto,
    entityManager?: EntityManager,
  ): Promise<User> {
    if (await this.userRepository.findOne({ email: createUserDto.email })) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exits`,
      );
    }
    const user = this.userRepository.create(createUserDto);
    return this.getRepository(entityManager).save(user);
  }

  private getRepository(entityManager?: EntityManager) {
    return entityManager
      ? entityManager.getCustomRepository(UserRepository)
      : this.userRepository;
  }
}
