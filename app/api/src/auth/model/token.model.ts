import { UserId } from '../../user/user.entity';

export class Token {
  public readonly access_token!: string;
}

export class TokenPayload {
  sub!: UserId;
  username!: string;
  roles!: string[];
}

export class RefreshTokenPayload {
  sub!: UserId;
}
