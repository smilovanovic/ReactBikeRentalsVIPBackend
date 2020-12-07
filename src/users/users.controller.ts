import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
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
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { UpdateUserDataDto } from './dto/update-user-data.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @Get('')
  async getUsers(@Query() searchUsersDto: SearchUsersDto) {
    const { count, users } = await this.usersService.search(searchUsersDto);
    return {
      count,
      users: users.map((user) => omit(user, ['password'])),
    };
  }

  @UsePipes(ValidatePipe)
  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @Post()
  create(@Body() createUserDataDto: CreateUserDataDto) {
    return this.usersService.create(createUserDataDto);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return omit(req.user, ['password', 'isActive']);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findOne({ id }, true);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return omit(user, ['password']);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    if (req.user.id === id) {
      throw new ForbiddenException("Can't delete your own account");
    }
    return this.usersService.delete(id);
  }

  @UsePipes(ValidatePipe)
  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateUserDataDto: UpdateUserDataDto,
  ) {
    if (req.user.id === id) {
      throw new ForbiddenException("Can't update your own account");
    }
    return this.usersService.update(id, updateUserDataDto);
  }
}
