import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PasswordModule } from '../password/password.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { GqlJwtAuthGuard } from './guard/gql-jwt.guard';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1000s' },
      }),
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
