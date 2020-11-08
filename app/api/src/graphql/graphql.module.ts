import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: path.join(process.cwd(), 'src/schema.graphql'),
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
      subscriptions: {
        keepAlive: 5000,
      },
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    }),
  ],
})
export class GQLModule {}
