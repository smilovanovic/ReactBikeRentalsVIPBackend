import { UserRole } from '../user.entity';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles?: UserRole[];
  isActive?: boolean;
}
