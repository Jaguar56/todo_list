import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { TodoStatus } from 'src/Entitiy/todo.entity';

@Injectable()
export class TodoStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TodoStatus.OPEN,
    TodoStatus.VIP,
    TodoStatus.COMPLETED,
  ];
  transform(value: any, metadata: ArgumentMetadata): any {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(
        `${value} не является правильным статусом. Выберите из трех значений (OPEN, VIP, COMPLETED)`,
      );
    }
    return value;
  }

  private isStatusValid(status: any) {
    const index = this.allowedStatus.indexOf(status);

    return index !== -1;
  }
}
