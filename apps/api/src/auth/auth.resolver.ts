import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { ResGql } from './decorator/res-gql.decorator';
import { LoginInputDto } from './dto/login-input.dto';

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
}
