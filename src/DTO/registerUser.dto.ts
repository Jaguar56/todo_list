import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(12)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Ваш пароль слишком простой, выберите более сложный пароль, не менее из 6 символов и не более 12',
  })
  password: string;
}
