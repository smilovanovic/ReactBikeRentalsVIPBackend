import { IsEmail, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @Matches(
    new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'),
    {
      message:
        'Password must contain: 1 lowercase char, 1 uppercase char, 1 number, 1 special char and must be min eight chars long!',
    },
  )
  password: string;
}
