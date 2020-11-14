import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterUserDto {
  @IsString()
  @Field(() => String)
  public name!: string;

  @IsString()
  @IsEmail()
  @Field(() => String)
  public email!: string;

  @IsString()
  @MinLength(8)
  @Field(() => String)
  public password!: string;
}
