import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guard/gql-jwt.guard';
import { UserIdDto } from './dto/user-id.dto';
import { User, UserId } from './user.entity';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  async user(@Args('id', { type: () => String }) id: UserId): Promise<User> {
    return this.userService.findOne(id);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation(() => UserIdDto)
  async deleteUser(
    @Args('id', { type: () => String }) id: UserId,
  ): Promise<UserIdDto> {
    const success = await this.userService.remove(id);
    if (!success) {
      throw new NotFoundException('User not found - nothing was deleted');
    }
    return { id };
  }
}
