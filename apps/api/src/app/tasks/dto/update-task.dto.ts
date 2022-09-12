import { TaskStatus } from '@prisma/client';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateTasksDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  status: TaskStatus;
}
