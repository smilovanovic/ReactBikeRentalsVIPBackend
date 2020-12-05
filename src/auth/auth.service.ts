import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne(email);
    if (user && (await user.isPasswordValid(pass))) {
      return omit(user, 'password');
    }
    return null;
  }

  async login(user: User) {
    const payload: JwtPayloadDto = {
      sub: user.id,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create({
      ...registerDto,
    });
    return this.login(user);
  }
}
