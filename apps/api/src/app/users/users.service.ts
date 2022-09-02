import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Users } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto): Promise<Users> {
    return prisma.users.create({ data: createUserDto });
  }

  findAll(): Promise<Users[]> {
    return prisma.users.findMany();
  }

  async findOne(username: string): Promise<Users> {
    const user = await prisma.users.findUnique({
      where: {
        username: username,
      },
      include: {
        tasks: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async update(username: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const updateUser = await prisma.users.findUnique({
      where: {
        username: username,
      },
    });

    if (!updateUser || updateUser.username !== username) {
      throw new NotFoundException('User Not Found');
    }

    return prisma.users.update({
      where: {
        username: username,
      },
      data: {
        ...updateUserDto,
      },
    });
  }

  async remove(username: string): Promise<Users> {
    const deleteUser = await prisma.users.findUnique({
      where: {
        username: username,
      },
    });

    if (!deleteUser || deleteUser.username !== username) {
      throw new NotFoundException('User not found');
    }

    return prisma.users.delete({
      where: {
        username: username,
      },
    });
  }
}
