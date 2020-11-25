import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import { ResGql } from './decorator/res-gql.decorator';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginInputDto } from './dto/login-input.dto';
import { JwtAuthGuard } from './guard/gql-jwt.guard';
import { JwtRefreshGuard } from './guard/gql-jwt-refresh.guard';
import { LoginPayload } from './dto/login-payload.dto';
import { RefreshPayload } from './dto/refresh-payload.dto';
import { LogoutPayload } from './dto/logout-payload.dto';

@Resolver('Auth')
export class AuthResolver {
  public constructor(private authService: AuthService) {}

  @Mutation(() => LoginPayload)
  public async login(
    @Args('input') { name, password }: LoginInputDto,
    @ResGql() res: Response,
  ): Promise<LoginPayload> {
    const user = await this.authService.getAuthenticatedUser(name, password);
    const {
      accessToken,
      refreshTokenCookie,
    } = await this.authService.refreshTokens(user);

    res.setHeader('Set-Cookie', [refreshTokenCookie]);
    return { accessToken, user };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => LogoutPayload)
  public async logout(
    @CurrentUser() { id, name }: User,
    @ResGql() res: Response,
  ): Promise<LogoutPayload> {
    this.authService.clearTokens(id);
    res.setHeader('Set-Cookie', this.authService.getCookiesForLogout());
    return { name };
  }

  @Mutation(() => User)
  public async registerUser(
    @Args('input') input: RegisterUserDto,
  ): Promise<User> {
    return this.authService.registerUser(input);
  }

  @UseGuards(JwtRefreshGuard)
  @Mutation(() => RefreshPayload)
  public async refresh(
    @ResGql() res: Response,
    @CurrentUser() user: User,
  ): Promise<RefreshPayload> {
    const {
      accessToken,
      refreshTokenCookie,
    } = await this.authService.refreshTokens(user);

    res.setHeader('Set-Cookie', [refreshTokenCookie]);
    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
