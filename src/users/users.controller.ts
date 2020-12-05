import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { omit } from 'lodash';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './user.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  @Get('profile')
  getProfile(@Request() req) {
    return omit(req.user, 'password');
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  @Post()
  create() {
    return 'Hello';
  }
}
