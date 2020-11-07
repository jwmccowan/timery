import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType('User')
export class User {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => String)
  id!: string;

  @Column({ nullable: false })
  @Field(() => String)
  name!: string;

  @Column({ nullable: false })
  @Field(() => String)
  email!: string;

  @Column({ default: true, nullable: false })
  @Field(() => Boolean)
  isActive!: boolean;
}
