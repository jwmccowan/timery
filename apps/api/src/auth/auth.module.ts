import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PasswordService } from '../password/password.service';
import { AuthService } from './auth.service';

@Module({
  imports: [PasswordService, UserService],
  providers: [AuthService],
})
export class AuthModule {}
