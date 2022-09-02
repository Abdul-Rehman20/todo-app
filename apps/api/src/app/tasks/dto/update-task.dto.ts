import { PartialType } from '@nestjs/mapped-types';
import { TasksDTO } from './create-task.dto';

export class UpdateTasksDTO extends PartialType(TasksDTO) {}
