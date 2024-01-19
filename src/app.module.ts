import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import entities from './Entitiy/entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'todo',
      entities,
      synchronize: true,
    }),
    TodoModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
