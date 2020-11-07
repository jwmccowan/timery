import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class LoginInputDto {
  @IsString()
  @Field(() => String)
  public name!: string;

  @IsString()
  @Field(() => String)
  public password!: string;
}
