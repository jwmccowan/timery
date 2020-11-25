import { IsEmail, IsString } from 'class-validator';

// TODO: this is just mostly the same shit as register-user.dto.ts
export class UserValidator {
  @IsString()
  public name!: string;

  @IsString()
  @IsEmail()
  public email!: string;

  @IsString()
  public passwordHash!: string;
}
