import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@ObjectType()
export class UserIdDto {
  @IsString()
  @IsUUID()
  @Field(() => String)
  id!: string;
}
