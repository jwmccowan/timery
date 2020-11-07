import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

export type UserId = string & { __brand: 'UserId' };
export const asUserId = (id: string): UserId => id as UserId;

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
  passwordHash!: string;
}
