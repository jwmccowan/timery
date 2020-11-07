import { Request, Response } from 'express';

export class CustomGraphQLContext {
  public readonly req!: Request;
  public readonly res!: Response;
}
