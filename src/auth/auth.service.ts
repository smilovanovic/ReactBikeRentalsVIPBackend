import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { Connection } from 'typeorm';
import { VerificationTokenService } from './verification-token.service';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private verificationTokenService: VerificationTokenService,
    private connection: Connection,
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
    return await this.connection.transaction(async (entityManager) => {
      const user = await this.usersService.create(
        { ...registerDto, isActive: false },
        entityManager,
      );
      const verificationToken = await this.verificationTokenService.create(
        { userId: user.id },
        entityManager,
      );
      const { email, firstName, lastName } = user;
      // send email...
      return user;
    });
  }
}
