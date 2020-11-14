import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from '../../user/user.entity';

@ObjectType('LoginPayload')
export class LoginPayload extends User {
  @IsString()
  @Field(() => String)
  public readonly accessToken!: string;
}
