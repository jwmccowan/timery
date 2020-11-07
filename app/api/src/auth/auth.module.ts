import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PasswordService } from '../password/password.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constant';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { GqlJwtAuthGuard } from './guard/gql-jwt.guard';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1000s' },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    PasswordService,
    UserService,
  ],
  providers: [
    AuthResolver,
    AuthService,
    GqlJwtAuthGuard,
    JwtStrategy,
    UserService,
  ],
  exports: [GqlJwtAuthGuard],
})
export class AuthModule {}
