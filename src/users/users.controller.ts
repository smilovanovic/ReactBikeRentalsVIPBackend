import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { omit } from 'lodash';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './user.entity';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findOne({ id: req.user.id });
    return omit(user, ['password', 'isActive']);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @Post()
  create() {
    return 'Hello';
  }
}
