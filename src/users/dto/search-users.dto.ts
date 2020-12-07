import { UserRole } from '../user.entity';

export class SearchUsersDto {
  role?: UserRole;
  skip?: number;
  take?: number;
  order?: string;
}
