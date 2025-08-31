// api/src/app/users/controllers/users.controller.spec.ts
import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';


describe('UsersController', () => {
  let controller: UsersController;

  const usersServiceMock = {
    list: jest.fn().mockResolvedValue({ items: [], page: 1, limit: 25, total: 0, pages: 0 }),
    findById: jest.fn().mockResolvedValue(null),
  };

  // No-op guards for unit testing
  class AllowAllGuard {
    canActivate() {
      return true;
    }
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(AllowAllGuard)
      .overrideGuard(RolesGuard)
      .useClass(AllowAllGuard)
      .compile();

    controller = module.get(UsersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('lists users via service', async () => {
    const res = await controller.findAll({ page: 1, limit: 25, sort: 'createdAt', order: 'DESC' } as any);
    expect(res).toHaveProperty('items');
    expect(usersServiceMock.list).toHaveBeenCalled();
  });

  it('gets user by id via service', async () => {
    await controller.findOne('u1');
    expect(usersServiceMock.findById).toHaveBeenCalledWith('u1');
  });
});
