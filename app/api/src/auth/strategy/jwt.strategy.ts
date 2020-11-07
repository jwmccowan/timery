import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { User } from '../../user/user.entity';
import { AuthService } from '../auth.service';
import { jwtConstants } from '../constant';

const cookieExtractor = (req: Request): string | null =>
  req?.cookies?.access_token ?? null;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: jwtConstants.secret,
    });
  }

  public validate(payload: any): Promise<User> {
    const user = this.authService.validateToken(payload);
    return user;
  }
}
