import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Tasks, TaskStatus } from '@prisma/client';
import { GetUser } from '../users/decorator/get-user.decorator';
import { TasksDTO } from './dto/create-task.dto';
import { UpdateTasksDTO } from './dto/update-task.dto';

const prisma = new PrismaClient();

@Injectable()
export class TasksService {
  create(user, newTask: TasksDTO) {
    return prisma.tasks.create({
      data: {
        title: newTask.title,
        description: newTask.description,
        userId: user.username,
      },
    });
  }

  findAll(): Promise<Tasks[]> {
    return prisma.tasks.findMany();
  }

  findOne(taskId: number): Promise<Tasks> {
    return prisma.tasks.findFirst({
      where: {
        id: taskId,
      },
    });
  }

  async update(taskId: number, updateTaskDto: UpdateTasksDTO): Promise<Tasks> {
    const updateTask = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!updateTask || updateTask.id !== taskId) {
      throw new NotFoundException(`Task with id ${taskId} not found!`);
    }

    if (
      updateTaskDto.status != TaskStatus.DONE &&
      updateTaskDto.status != TaskStatus.IN_PROGRESS &&
      updateTaskDto.status != TaskStatus.PENDING
    ) {
      throw new NotFoundException(
        'Status value must be "DONE" "IN_PROGRESS" "PENDING"'
      );
    }

    return prisma.tasks.update({
      where: {
        id: taskId,
      },
      data: {
        ...updateTaskDto,
      },
    });
  }

  async remove(taskId: number): Promise<Tasks> {
    const deleteTask = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!deleteTask) {
      throw new NotFoundException('Task to be deleted not found');
    }
    return prisma.tasks.delete({
      where: {
        id: taskId,
      },
    });
  }
}
