import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  AuthRepository,
  UserEmail,
  UserEncryptedPassword,
  UserId,
} from 'src/domain';
import { JwtPayloadInterface } from 'src/utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements AuthRepository {
  constructor(private readonly jwtService: JwtService) {}

  async comparePassword(
    plainPassword: string,
    password: UserEncryptedPassword,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, password.value);
  }

  encryptPassword(plainPassword: string): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hash(plainPassword, salt);
  }

  verifyToken(token: string): Promise<boolean> {
    return this.jwtService.verify(token).then(() => true);
  }

  async createToken(userId: UserId, email: UserEmail) {
    const payload: JwtPayloadInterface = {
      id: userId.value,
      email: email.value,
    };
    return this.jwtService.sign(payload);
  }
}
