import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Brand, createBrander } from '../utils';
import { BaseNodeEntity } from '../database/base.entity';
import { UserRepository } from './user.repository';
import { UUID } from '../common/types';
import { UserValidator } from './user.validator';

/**
 * UserId: a special wrapper for string to let us know this is a UserId
 */
export type UserId = Brand<UUID, 'UserId'>;

/**
 * Takes a string and returns a UserId
 * Make sure it's a UUID or it'll be weird!
 *
 * @param id UUID to be made into a UserId
 * @returns UserId
 */
export const asUserId = createBrander<UserId>();

/**
 * User
 *
 * The User type to be used throughout the app
 */
@Entity({ tableName: 'user' })
@ObjectType('user')
export class User extends BaseNodeEntity<User, UserId> {
  @Property({ nullable: false, type: String, unique: true })
  @Field(() => String)
  public name!: string;

  @Property({ nullable: false, type: String })
  @Field(() => String)
  public email!: string;

  @Property({ default: true, nullable: false, type: Boolean })
  @Field(() => Boolean)
  public isActive = true;

  @Property({ nullable: false, type: String })
  // No GQL Field since we want it in db but not ever sent to user
  public passwordHash!: string;

  @Property({ nullable: true, type: String })
  public currentRefreshTokenHash?: string | null;

  public [EntityRepositoryType]?: UserRepository;

  public constructor(body: UserValidator) {
    super(body);
  }
}
