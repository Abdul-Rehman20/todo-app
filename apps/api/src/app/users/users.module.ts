import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TasksService } from '../tasks/tasks.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, TasksService],
})
export class UsersModule {}
