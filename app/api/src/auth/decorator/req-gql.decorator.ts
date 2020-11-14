import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomGraphQLContext } from './custom-graphql-context';

export function getGqlRequest(context: ExecutionContext): any {
  const graphqlContext = GqlExecutionContext.create(context);
  return graphqlContext.getContext<CustomGraphQLContext>()?.req || null;
}

export const ReqGql = createParamDecorator((_, context: ExecutionContext) =>
  getGqlRequest(context),
);
