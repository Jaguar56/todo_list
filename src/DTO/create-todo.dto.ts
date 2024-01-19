import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @MaxLength(15, { message: 'Максимальная длинна title 15 символов' })
  title: string;

  @IsNotEmpty()
  description: string;
}
