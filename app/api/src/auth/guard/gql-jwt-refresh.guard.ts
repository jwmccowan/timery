import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { getGqlRequest } from '../decorator/req-gql.decorator';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  public getRequest(context: ExecutionContext) {
    return getGqlRequest(context);
  }

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // TODO: here we can add custom authentication logic
    // For example: call super.logIn(request) to establish a session
    return super.canActivate(context);
  }
}
