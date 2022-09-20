import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Res,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { Serialize } from '../interceptors/serialize.interceptor';
import { userDto } from './dto/user.dto';

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
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.usersService.findOneUsername(username);
    if (!user) {
      throw new NotFoundException('User Does Not Exist');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new NotFoundException('Bad Password');
    }
    const jwt = await this.jwtService.signAsync({ username: user.username });
    response.cookie('jwt', jwt, { httpOnly: true });
    return user;
  }

  @UseInterceptors(AuthInterceptor)
  @Get('whoami')
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    const user = await this.usersService.findOneUsername(data['username']);
    return user;
  }

  @UseInterceptors(AuthInterceptor)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return 'Success';
  }

  @UseInterceptors(AuthInterceptor)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseInterceptors(AuthInterceptor)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @UseInterceptors(AuthInterceptor)
  @Patch(':username')
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(username, updateUserDto);
  }

  @UseInterceptors(AuthInterceptor)
  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.usersService.remove(username);
  }
}
