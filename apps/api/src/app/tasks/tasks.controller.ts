import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TaskStatus } from '@prisma/client';
import { AuthInterceptor } from '../users/interceptor/auth.interceptor';
import { UsersService } from '../users/users.service';
import { TasksDTO } from './dto/create-task.dto';
import { UpdateTasksDTO } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@UseInterceptors(AuthInterceptor)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@Body() newTaskDto: TasksDTO) {
    const task = await this.usersService.findOneUsername(newTaskDto.userId);
    if (!task) {
      throw new NotFoundException('Username Not Found');
    }
    return this.tasksService.create(newTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const foundTask = await this.tasksService.findOne(+id);
    if (!foundTask) {
      throw new NotFoundException('NOT FOUND');
    }
    return foundTask;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTasksDTO) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
