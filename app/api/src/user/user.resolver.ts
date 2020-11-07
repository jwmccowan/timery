import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto } from './dto/create-user.dto';
import { UserIdDto } from './dto/user-id.dto';
import { User, UserId } from './user.entity';
import { UserService } from './user.service';

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
    await this.userService.remove(id);
    return { id };
  }

  @Mutation(() => User)
  async createUser(
    @Args('input', { type: () => CreateUserDto }) input: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(input);
  }
}
