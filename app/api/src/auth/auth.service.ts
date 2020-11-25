import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User, UserId } from '../user/user.entity';
import { PasswordService } from '../password/password.service';
import { RefreshTokenPayload, TokenPayload } from './model/token.model';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private userService: UserService,
  ) {}

  public async refreshTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshTokenCookie: string }> {
    const accessToken = this.getJwtToken(user);
    const refreshToken = this.getRefreshToken(user);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    const refreshTokenCookie = this.getRefreshCookie(refreshToken);
    return { accessToken, refreshTokenCookie };
  }

  public async clearTokens(id: UserId): Promise<void> {
    await this.userService.removeCurrentRefreshToken(id);
  }

  public async getAuthenticatedUser(
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

  public async validateToken({ sub }: TokenPayload): Promise<User> {
    return this.userService.findOne(sub);
  }

  public async registerUser({
    password,
    ...rest
  }: RegisterUserDto): Promise<User> {
    const passwordHash = await this.passwordService.hashPassword(password);
    return this.userService.create({ ...rest, passwordHash });
  }

  public getJwtToken(user: User): string {
    const payload: TokenPayload = {
      roles: [],
      sub: user.id,
      username: user.name,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION'),
    });
    return token;
  }

  public getRefreshCookie(token: string): string {
    return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION',
    )}`;
  }

  public getRefreshToken(user: User): string {
    const payload: RefreshTokenPayload = {
      sub: user.id,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION'),
    });
  }

  public getCookiesForLogout(): [string] {
    return ['Refresh; HttpOnly; Path=/; Max-Age=0'];
  }
}
