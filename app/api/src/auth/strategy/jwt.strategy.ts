import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { ConfigService } from '../../config/config.service';
import { User } from '../../user/user.entity';
import { TokenPayload } from '../model/token.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private readonly userService: UserService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          req?.header('Authorization')?.replace('Bearer ', '') ?? null,
      ]),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  public validate({ sub }: TokenPayload): Promise<User> {
    try {
      return this.userService.findOne(sub);
    } catch (error) {
      throw new UnauthorizedException('Authentication Error');
    }
  }
}
