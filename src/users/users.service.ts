import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { SearchUsersDto } from './dto/search-users.dto';

@Injectable()
export class UsersService {
  private defaultConditions: FindConditions<User> = { isActive: true };
  constructor(private userRepository: UserRepository) {}

  async findOne(params: FindConditions<User>): Promise<User | undefined> {
    return this.userRepository.findOne({
      ...this.defaultConditions,
      ...params,
    });
  }

  async search(
    params: SearchUsersDto,
  ): Promise<{ count: number; users: User[] }> {
    const { skip, take } = params;
    const [users, count] = await this.userRepository.findAndCount({
      skip,
      take,
      order: { createAt: -1 },
    });
    return { count, users };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (await this.userRepository.findOne({ email: createUserDto.email })) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }
}
