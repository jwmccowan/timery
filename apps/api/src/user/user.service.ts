import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findOne(id: string): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  public async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  public async create(input: CreateUserDto): Promise<User> {
    const id = uuidv4();
    return this.userRepository.save({ ...input, id, isActive: true });
  }
}
