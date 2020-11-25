import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from '../../user/user.entity';

@ObjectType('LoginPayload')
export class LoginPayload {
  @IsString()
  @Field(() => String)
  public readonly accessToken!: string;

  @Field(() => User)
  public readonly user!: User;
}
