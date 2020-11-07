import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getGqlRequest } from './req-gql.decorator';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    return getGqlRequest(context).user;
  },
);
