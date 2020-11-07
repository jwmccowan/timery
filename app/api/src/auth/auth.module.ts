import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PasswordModule } from '../password/password.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './constant';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { GqlJwtAuthGuard } from './guard/gql-jwt.guard';
import { UserModule } from '../user/user.module';
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
    PasswordModule,
    UserModule,
  ],
  providers: [AuthResolver, AuthService, GqlJwtAuthGuard, JwtStrategy],
  exports: [GqlJwtAuthGuard],
})
export class AuthModule {}
