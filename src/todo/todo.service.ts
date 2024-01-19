import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity, TodoStatus } from 'src/Entitiy/todo.entity';
import { CreateTodoDto } from 'src/DTO/create-todo.dto';
import { UserEntity } from 'src/Entitiy/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoReposity: Repository<TodoEntity>,
  ) {}

  async findAll(user: UserEntity) {
    const query = this.todoReposity.createQueryBuilder('todo');

    query.where(`todo.userId = :userId`, { userId: user.id });

    try {
      return await query.getMany();
    } catch (err) {
      throw new NotFoundException('Список дел не найден');
    }
  }

  async createTodo(createTodoDto: CreateTodoDto, user: UserEntity) {
    const todo = new TodoEntity();
    const { title, description } = createTodoDto;
    todo.title = title;
    todo.description = description;
    todo.status = TodoStatus.OPEN;
    todo.userId = user.id;

    this.todoReposity.create(todo);
    try {
      return await this.todoReposity.save(todo);
    } catch (err) {
      throw new InternalServerErrorException(
        'Что-то пошло не так, таблица todo не создана',
      );
    }
  }

  async update(id: number, status: TodoStatus, user: UserEntity) {
    try {
      await this.todoReposity.update({ id, userId: user.id }, { status });
      return this.todoReposity.findOne({ where: { id: id } });
    } catch (err) {
      throw new InternalServerErrorException('Что-то пошло не так :(');
    }
  }

  async delete(id: number, user: UserEntity) {
    const res = await this.todoReposity.delete({ id, userId: user.id });

    if (res.affected === 0) {
      throw new NotFoundException('Запись не удалена');
    } else {
      return { success: true };
    }
  }
}
