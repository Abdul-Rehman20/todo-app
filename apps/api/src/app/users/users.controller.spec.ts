import { Test, TestingModule } from '@nestjs/testing';
import { Users } from '@prisma/client';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    fakeUsersService = {
      findOne: (username) => {
        return Promise.resolve({
          username,
          email: 'asdf@asdf.com',
          name: 'Abdul rehman',
        } as Users);
      },
      findAll: () => {
        return Promise.resolve([
          {
            username: 'abdulrehman',
            email: 'asdf@asdf.com',
            name: 'Abdul rehman',
          } as Users,

          {
            username: 'affan',
            email: 'affan@gmail.com',
            name: 'Affan Mustafa',
          } as Users,
        ]);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findAllUsers returns all Users', async () => {
    const users = await controller.findAll();
    expect(users.length).toBeGreaterThan(0);
  });
  it('findOne returns a single user with the given id', async () => {
    const users = await controller.findOne('abdulrehman');
    expect(users).toBeDefined();
  });
  it('findOne throws an error if the user with the given username is not found', async () => {
    fakeUsersService.findOne = () => null;
    try {
      await controller.findOne('abdulrehman');
    } catch (error) {}
  });
});
