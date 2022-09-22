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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TasksDTO } from './dto/create-task.dto';
import { UpdateTasksDTO } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../users/decorator/get-user.decorator';

// @UseInterceptors(AuthInterceptor)
@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@GetUser() user, @Body() newTaskDto: TasksDTO) {
    const task = await this.usersService.findOneUsername(user.username);
    if (!task) {
      throw new NotFoundException('Username Not Found');
    }
    return this.tasksService.create(user, newTaskDto);
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
