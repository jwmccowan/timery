import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user';
import { ResGql } from './decorator/res-gql.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginInputDto } from './dto/login-input.dto';
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
    console.log('eggs', res);
    res.cookie('access_token', access_token, { httpOnly: true });
    return user;
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
