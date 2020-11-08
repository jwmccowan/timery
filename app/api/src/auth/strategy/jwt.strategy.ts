import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';
import { User } from '../../user/user.entity';
import { AuthService } from '../auth.service';

const cookieExtractor = (req: Request): string | null =>
  req?.cookies?.access_token ?? null;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  public validate(payload: any): Promise<User> {
    const user = this.authService.validateToken(payload);
    return user;
  }
}
