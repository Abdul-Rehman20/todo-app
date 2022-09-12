import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, UsersService],
})
export class TasksModule {}
