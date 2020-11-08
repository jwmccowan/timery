import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import { ResGql } from './decorator/res-gql.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginInputDto } from './dto/login-input.dto';
import { LogoutPayload } from './dto/logout-payload.dto';
import { GqlJwtAuthGuard } from './guard/gql-jwt.guard';

@Resolver('Auth')
export class AuthResolver {
  public constructor(private authService: AuthService) {}

  @Mutation(() => User)
  public async login(
    @Args('input') { name, password }: LoginInputDto,
    @ResGql() res: Response,
  ): Promise<User> {
    const { access_token, user } = await this.authService.login(name, password);
    res.cookie('access_token', access_token, { httpOnly: true });
    return user;
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => LogoutPayload)
  public async logout(
    @CurrentUser() { name }: User,
    @ResGql() res: Response,
  ): Promise<LogoutPayload> {
    res.cookie('access_token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    return { name };
  }

  @Mutation(() => User)
  public async createUser(@Args('input') input: CreateUserDto): Promise<User> {
    return this.authService.createUser(input);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => User)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
