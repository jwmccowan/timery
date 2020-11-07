import { Request, Response } from 'express';

export interface CustomGraphQLContext {
  req: Request;
  res: Response;
}

// export class CustomGraphQLContext {
//   public readonly req!: Request;
//   public readonly res!: Response;
// }
