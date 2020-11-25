import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { User, UserId } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  /**
   * findAll()
   * Returns all users
   * TODO: this needs to obviously have some filters, least of which is
   * restrictions based on permissions
   * @returns User[] - list of all Users
   */
  public async findAll(): Promise<User[]> {
    return this.em.getRepository(User).findAll();
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
    return this.em.getRepository(User).findOneOrFail(id);
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
    return this.em.getRepository(User).findOneOrFail({ name });
  }

  /**
   * remove(id)
   * Removes the user with the given id
   *
   * @param id UserId by which to search
   * @returns Promise<Boolean> - whether the user was deleted or not
   * TODO: always returns true
   */
  public async remove(id: UserId): Promise<void> {
    const user = await this.findOne(id);
    user.deletedAt = new Date();
    await this.em.flush();
  }

  public async create({
    email,
    name,
    passwordHash,
  }: Pick<User, 'passwordHash' | 'name' | 'email'>): Promise<User> {
    const user = new User({
      email,
      name,
      passwordHash,
    });
    console.log('eggs', this.em);
    await this.em.persistAndFlush(user);
    return user;
  }

  public async setCurrentRefreshToken(
    refreshToken: string,
    id: UserId,
  ): Promise<void> {
    const currentRefreshTokenHash = await hash(refreshToken, 10);

    const user = await this.findOne(id);
    user.currentRefreshTokenHash = currentRefreshTokenHash;
    await this.em.flush();
  }

  public async removeCurrentRefreshToken(id: UserId): Promise<void> {
    const user = await this.findOne(id);
    user.currentRefreshTokenHash = null;
    await this.em.flush();
  }

  public async getUserIfRefreshTokenMatches(
    refreshToken: string,
    id: UserId,
  ): Promise<User> {
    const user = await this.findOne(id);

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
