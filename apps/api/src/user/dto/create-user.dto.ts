import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsString()
  @Field(() => String)
  public name!: string;

  @IsString()
  @IsEmail()
  @Field(() => String)
  public email!: string;
}
