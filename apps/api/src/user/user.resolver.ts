import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto } from './dto/create-user.dto';
import { UserIdDto } from './dto/user-id.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => User)
  async user(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Query((returns) => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation((returns) => UserIdDto)
  async deleteUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<UserIdDto> {
    await this.userService.remove(id);
    return { id };
  }

  @Mutation((returns) => User)
  async createUser(
    @Args('input', { type: () => CreateUserDto }) input: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(input);
  }
}
