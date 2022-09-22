import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class TasksDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;
}
