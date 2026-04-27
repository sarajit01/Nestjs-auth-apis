import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { createHash } from 'crypto';

@Injectable()
export class HasherService {
  constructor() {}
  async hashPassword(hashable: string): Promise<string> {
    return await argon2.hash(hashable);
  }

  // Compare the login attempt with the stored hash
  async comparePassword(
    storedHash: string,
    attemptedString: string,
  ): Promise<boolean> {
    return await argon2.verify(storedHash, attemptedString);
  }

  hashToken(hashable: string) {
    return createHash('sha256').update(hashable).digest('hex');
  }
}
