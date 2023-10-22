import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { USER_FINDER, UserFinder } from './service/user-finder.service';
import {
  AUTH_REPOSITORY,
  AuthRepository,
  USER_REPOSITORY,
  UserEmail,
  UserEncryptedPassword,
  UserNotFoundError,
  UserRepository,
} from 'src/domain';
import { UserDTO } from 'src/utils';

export const LOGIN_USER = 'LOGIN_USER';

@Injectable()
export class LoginUser {
  constructor(
    @Inject(USER_FINDER) private readonly userFinder: UserFinder,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
  ) {}

  async execute(email: string, password: string): Promise<UserDTO> {
    const userEmail = UserEmail.with(email);
    const user: UserDTO = await this.userFinder.findByEmail(userEmail);
    const userPassword = UserEncryptedPassword.with(user.password);
    if (!user) {
      throw UserNotFoundError.withEmail(userEmail);
    }

    if (!(await this.authRepository.comparePassword(password, userPassword))) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
