import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { asUserId, User } from './user.entity';
import { UserService } from './user.service';

const userArray: User[] = [
  {
    id: asUserId(''),
    name: 'john',
    passwordHash: 'password',
    isActive: true,
    email: 'john@john.com',
  },
  {
    id: asUserId(''),
    name: 'john2',
    passwordHash: 'password',
    isActive: true,
    email: 'john@john.com',
  },
];

const oneUser: User = { ...userArray[0] };

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(userArray),
            findOneOrFail: jest.fn().mockResolvedValue(oneUser),
            delete: jest.fn().mockResolvedValue(true),
            save: jest.fn().mockResolvedValue(oneUser),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of User', async () => {
      const users = await service.findAll();
      expect(users).toEqual(userArray);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const id = 'a uuid';
      const repoSpy = jest.spyOn(repo, 'findOneOrFail');
      expect(service.findOne(asUserId(id))).resolves.toEqual(oneUser);
      expect(repoSpy).toBeCalledWith(id);
    });
  });

  describe('findOneByName', () => {
    it('should return a single user', async () => {
      const name = 'john';
      const repoSpy = jest.spyOn(repo, 'findOneOrFail');
      expect(service.findOneByName(name)).resolves.toEqual(oneUser);
      expect(repoSpy).toBeCalledWith({ name });
    });
  });

  describe('remove', () => {
    it('should return true', async () => {
      const id = 'a uuid';
      const repoSpy = jest.spyOn(repo, 'delete');
      expect(service.remove(asUserId(id))).resolves.toEqual(true);
      expect(repoSpy).toBeCalledWith(id);
    });
  });

  describe('create', () => {
    it('should return a new user', async () => {
      const repoSpy = jest.spyOn(repo, 'save');
      expect(service.create(oneUser)).resolves.toEqual(oneUser);
      expect(repoSpy).toBeCalledWith(oneUser);
    });
  });
});
