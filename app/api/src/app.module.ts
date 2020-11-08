import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { GQLModule } from './graphql/graphql.module';

@Module({
  imports: [AuthModule, GQLModule, DatabaseModule, UserModule],
})
export class AppModule {}
