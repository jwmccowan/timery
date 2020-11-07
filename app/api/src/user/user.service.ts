import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserId } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findOne(id: UserId): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  public async findOneByName(name: string): Promise<User> {
    return this.userRepository.findOneOrFail({ name });
  }

  public async remove(id: UserId): Promise<void> {
    await this.userRepository.delete(id);
  }

  public async create(user: Omit<User, 'isActive'>): Promise<User> {
    return this.userRepository.save({ ...user, isActive: true });
  }
}
