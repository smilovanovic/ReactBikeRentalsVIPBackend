import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { omit } from 'lodash';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './user.entity';
import { UsersService } from './users.service';
import { SearchUsersDto } from './dto/search-users.dto';
import { ValidatePipe } from '../common/validate.pipe';
import { UpsertUserDataDto } from './dto/upsert-user-data.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  async getUsers(@Query() searchUsersDto: SearchUsersDto) {
    const { count, users } = await this.usersService.search(searchUsersDto);
    return {
      count,
      users: users.map((user) => omit(user, ['password'])),
    };
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return omit(req.user, ['password', 'isActive']);
  }

  @UsePipes(ValidatePipe)
  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @Post()
  create(@Body() upsertUserDataDto: UpsertUserDataDto) {
    return this.usersService.create(upsertUserDataDto);
  }
}
