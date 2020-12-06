import { IsBoolean, IsArray, IsEnum } from 'class-validator';
import { RegisterDto } from '../../auth/dto/register.dto';
import { UserRole } from '../user.entity';

export class UpsertUserDataDto extends RegisterDto {
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];

  @IsBoolean()
  isActive: boolean;
}
