import { TaskStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class TasksDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  status: TaskStatus;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
