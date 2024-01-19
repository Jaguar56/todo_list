import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from 'src/DTO/create-todo.dto';
import { TodoStatus } from 'src/Entitiy/todo.entity';
import { TodoStatusValidationPipe } from 'src/pipes/todostatusvalidation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/Entitiy/user.entity';

@Controller('todo')
@UseGuards(AuthGuard())
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(@User() user: UserEntity) {
    return this.todoService.findAll(user);
  }

  @Post()
  createNewTodo(
    @Body(ValidationPipe) data: CreateTodoDto,
    @User() user: UserEntity,
  ) {
    return this.todoService.createTodo(data, user);
  }

  @Patch(':id')
  updateTodo(
    @Body('status', TodoStatusValidationPipe) status: TodoStatus,
    @Param('id') id: number,
    @User() user: UserEntity,
  ) {
    return this.todoService.update(id, status, user);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: number, @User() user: UserEntity) {
    return this.todoService.delete(id, user);
  }
}
