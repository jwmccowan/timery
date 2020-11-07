import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsString()
  @Field((returns) => String)
  public name!: string;

  @IsString()
  @IsEmail()
  @Field((returns) => String)
  public email!: string;
}
