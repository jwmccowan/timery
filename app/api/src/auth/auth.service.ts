import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { UserService } from '../user/user.service';
import { asUserId, User, UserId } from '../user/user.entity';
import { PasswordService } from '../password/password.service';
import { Token } from './model/token.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private userService: UserService,
  ) {}

  public async validateUserByPassword(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userService.findOneByName(username);

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

  public generateToken<T extends Record<string, unknown>>(payload: T): Token {
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  public async login(
    username: string,
    password: string,
  ): Promise<Token & { user: User }> {
    const user = await this.validateUserByPassword(username, password);

    return {
      ...this.generateToken({ username: user.name, sub: user.id }),
      user,
    };
  }

  public async createUser({ password, ...rest }: CreateUserDto): Promise<User> {
    const id = asUserId(uuid());
    const passwordHash = await this.passwordService.hashPassword(password);

    return this.userService.create({ ...rest, id, passwordHash });
  }
}
