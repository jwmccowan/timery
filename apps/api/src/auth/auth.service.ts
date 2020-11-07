import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { asUserId, User, UserId } from '../user/user.entity';
import { PasswordService } from '../password/password.service';

@Injectable()
export class AuthService {
  constructor(
    private passwordService: PasswordService,
    private userService: UserService,
  ) {}

  public async validateUserByPassword(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userService.findOneByName(username);

    // TODO: implement password service with an api something like:
    const passwordValid = this.passwordService.validatePassword(
      password,
      user.passwordHash,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Incorrect Password');
    }
    return user;
  }

  public async validateUserById(id: UserId): Promise<User> {
    try {
      return this.userService.findOne(id);
    } catch (e) {
      throw new UnauthorizedException('Authentication validation error');
    }
  }

  public async validateToken({ sub }: { sub: string }): Promise<User> {
    return this.validateUserById(asUserId(sub));
  }
}
