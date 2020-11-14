import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PasswordModule } from '../password/password.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { JwtAuthGuard } from './guard/gql-jwt.guard';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshGuard } from './guard/gql-jwt-refresh.guard';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    PasswordModule,
    UserModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
    JwtRefreshGuard,
    JwtRefreshTokenStrategy,
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
