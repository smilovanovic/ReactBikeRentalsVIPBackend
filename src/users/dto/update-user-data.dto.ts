import { Matches } from 'class-validator';
import { CreateUserDataDto } from './create-user-data.dto';

export class UpdateUserDataDto extends CreateUserDataDto {
  @Matches(
    new RegExp(
      '^$|^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
    ),
    {
      message:
        'Password must contain: 1 lowercase char, 1 uppercase char, 1 number, 1 special char and must be min eight chars long!',
    },
  )
  password: string;
}
