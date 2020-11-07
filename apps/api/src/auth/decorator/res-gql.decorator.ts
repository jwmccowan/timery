import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomGraphQLContext } from './custom-graphql-context';

export function getGqlResponse(context: ExecutionContext) {
  const graphqlContext = GqlExecutionContext.create(context);
  return graphqlContext.getContext<CustomGraphQLContext>()?.res || null;
}

export const ResGql = createParamDecorator((_, context) => {
  getGqlResponse(context);
});
