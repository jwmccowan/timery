import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType('LogoutPayload')
export class LogoutPayload {
  @IsString()
  @Field(() => String)
  public readonly name!: string;
}
