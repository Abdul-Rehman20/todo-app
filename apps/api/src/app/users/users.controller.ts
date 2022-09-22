import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Serialize } from '../interceptors/serialize.interceptor';
import { userDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';
import { Users } from '@prisma/client';

@Controller('users')
@Serialize(userDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string
  ) {
    return this.usersService.login(username, password);
  }

  @UseGuards(AuthGuard())
  @Get('whoami')
  async user(@GetUser() user: Users) {
    return user;
  }

  @UseGuards(AuthGuard())
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return 'Success';
  }

  @UseGuards(AuthGuard())
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard())
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @UseGuards(AuthGuard())
  @Patch(':username')
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(username, updateUserDto);
  }

  @UseGuards(AuthGuard())
  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.usersService.remove(username);
  }
}
