import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { PrismaClient, Users } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './dto/jwt-payload.interface';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  constructor(private jwtService: JwtService) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.findOneUsername(createUserDto.username);
    if (user) {
      throw new NotFoundException('Username Already taken');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hash;

    return await prisma.users.create({ data: createUserDto });
  }

  findAll(): Promise<Users[]> {
    return prisma.users.findMany();
  }

  findOneUsername(username: string): Promise<Users> {
    return prisma.users.findUnique({
      where: {
        username: username,
      },
    });
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

  async login(username: string, password: string) {
    const user = await this.findOneUsername(username);
    if (!user) {
      throw new NotFoundException('User Does Not Exist');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new NotFoundException('Bad Password');
    }
    const payload: JwtPayLoad = { username };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }
}
