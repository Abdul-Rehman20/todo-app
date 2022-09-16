import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

let mockUsersRepository = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'AbdulRehman',
  name: 'Abdul Rehman Hameedullah',
  email: 'abdulrehman@gmail.com',
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get(UsersService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
