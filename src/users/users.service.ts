import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { SearchUsersDto } from './dto/search-users.dto';
import { Not } from 'typeorm';
import { UpdateUserDataDto } from './dto/update-user-data.dto';

@Injectable()
export class UsersService {
  private defaultConditions: FindConditions<User> = { isActive: true };
  constructor(private userRepository: UserRepository) {}

  findOne(
    params: FindConditions<User>,
    skipDefaultParams = false,
  ): Promise<User | undefined> {
    return this.userRepository.findOne({
      ...(skipDefaultParams ? {} : this.defaultConditions),
      ...params,
    });
  }

  async search(
    params: SearchUsersDto,
  ): Promise<{ count: number; users: User[] }> {
    const { skip, take, order } = params;
    const [users, count] = await this.userRepository.findAndCount({
      skip,
      take,
      order: order ? JSON.parse(order) : { createAt: -1 },
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

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return !!result.affected;
  }

  async update(
    id: string,
    updateUserDataDto: UpdateUserDataDto,
  ): Promise<boolean> {
    const found = await this.userRepository.findOne({
      email: updateUserDataDto.email,
      id: Not(id),
    });
    if (found) {
      throw new ConflictException(
        `User with email ${updateUserDataDto.email} already exists`,
      );
    }
    if (!updateUserDataDto.password) {
      delete updateUserDataDto.password;
    }
    const result = await this.userRepository.update(id, updateUserDataDto);
    return !!result.affected;
  }
}
