import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

Injectable();
export class PasswordService {
  public async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  public async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }
}
