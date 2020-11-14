import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType('RefreshPayload')
export class RefreshPayload {
  @IsString()
  @Field(() => String)
  public readonly accessToken!: string;
}
