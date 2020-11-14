import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { User, UserId } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * findAll()
   * Returns all users
   * TODO: this needs to obviously have some filters, least of which is
   * restrictions based on permissions
   * @returns User[] - list of all Users
   */
  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * findOne(id)
   * Searches for a user by id
   * throws an error if the user doesn't exist
   *
   * @param id UserId by which to search
   * @returns Promise<User> - User with the id
   */
  public async findOne(id: UserId): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }
  /**
   * findOne(name)
   * Searches for a user by name
   * name is unique in the db, so can only return one user
   * throws an error if the user doesn't exist
   *
   * @param name name by which to search
   * @returns Promise<User> - User with the name
   */
  public async findOneByName(name: string): Promise<User> {
    return this.userRepository.findOneOrFail({ name });
  }

  /**
   * remove(id)
   * Removes the user with the given id
   *
   * @param id UserId by which to search
   * @returns Promise<Boolean> - whether the user was deleted or not
   * TODO: always returns true
   */
  public async remove(id: UserId): Promise<boolean> {
    const result = await this.userRepository.softDelete(id);
    return !!result.affected && result.affected > 0;
  }

  public async create(
    user: Pick<User, 'id' | 'passwordHash' | 'name' | 'email'>,
  ): Promise<User> {
    return this.userRepository.save({ ...user, isActive: true });
  }

  public async setCurrentRefreshToken(
    refreshToken: string,
    id: UserId,
  ): Promise<void> {
    const currentRefreshTokenHash = await hash(refreshToken, 10);
    await this.userRepository.update(id, {
      currentRefreshTokenHash,
    });
  }

  public async removeCurrentRefreshToken(id: UserId): Promise<void> {
    await this.userRepository.update(id, {
      currentRefreshTokenHash: undefined,
    });
  }

  public async getUserIfRefreshTokenMatches(
    refreshToken: string,
    id: UserId,
  ): Promise<User> {
    const user = await this.findOne(id);

    console.log('eggs', 'user', user);

    const doesRefreshTokenMatch = await compare(
      refreshToken,
      user.currentRefreshTokenHash ?? '',
    );
    if (!doesRefreshTokenMatch) {
      throw new NotFoundException('Refresh token does not match');
    }

    return user;
  }
}
