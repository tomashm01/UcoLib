import { UserEmail, UserEncryptedPassword, UserId } from '../user';

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';

export interface AuthRepository {
  verifyToken(token: string): Promise<boolean>;
  createToken(id: UserId, email: UserEmail): Promise<string>;
  encryptPassword(plainPassword: string): Promise<string>;
  comparePassword(
    plainPassword: string,
    password: UserEncryptedPassword,
  ): Promise<boolean>;
}
