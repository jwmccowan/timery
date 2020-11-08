import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
/**
 * UserId: a special wrapper for string to let us know this is a UserId
 */
export type UserId = string & { __brand: 'UserId' };
/**
 * Takes a string and returns a UserId
 * Make sure it's a UUID or it'll be weird!
 *
 * @param id UUID to be made into a UserId
 * @returns UserId
 */
export const asUserId = (id: string): UserId => id as UserId;

/**
 * User
 *
 * The User type to be used throughout the app
 */
@Entity('user')
@ObjectType('user')
export class User {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => String)
  id!: UserId;

  @Column({ nullable: false, unique: true })
  @Field(() => String)
  name!: string;

  @Column({ nullable: false })
  @Field(() => String)
  email!: string;

  @Column({ default: true, nullable: false })
  @Field(() => Boolean)
  isActive!: boolean;

  @Column({ nullable: false })
  // No GQL Field since we want it in db but not ever sent to user
  passwordHash!: string;
}
