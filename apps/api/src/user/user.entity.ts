import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType('User')
export class User {
  @PrimaryColumn({ type: 'uuid' })
  @Field((type) => String)
  id!: string;

  @Column({ nullable: false })
  @Field((type) => String)
  name!: string;

  @Column({ nullable: false })
  @Field((type) => String)
  email!: string;

  @Column({ default: true, nullable: false })
  @Field((type) => Boolean)
  isActive!: boolean;
}
