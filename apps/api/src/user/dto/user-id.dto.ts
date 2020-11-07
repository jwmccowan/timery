import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { UserId } from '../user.entity';

@ObjectType()
export class UserIdDto {
  @IsString()
  @IsUUID()
  @Field(() => String)
  id!: UserId;
}
