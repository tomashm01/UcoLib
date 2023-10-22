import { Inject, Injectable } from '@nestjs/common';

import { UserDTO } from 'src/utils';
import {
  AUTH_REPOSITORY,
  AuthRepository,
  User,
  UserEmail,
  UserEncryptedPassword,
  UserId,
  UserName,
  UserPlainPassword,
} from '../../domain';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/user/model/user.repository';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from 'src/domain/user/exception';
import { USER_FINDER, UserFinder } from './service/user-finder.service';

export const UPDATE_USER = 'UPDATE_USER';

@Injectable()
export class UpdateUser {
  constructor(
    @Inject(USER_FINDER) private readonly userFinder: UserFinder,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
  ) {}

  async execute(
    id: string,
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    const userId: UserId = UserId.with(id);

    const userEmail = UserEmail.with(email);
    const userPlainPassword = UserPlainPassword.with(password);
    const hashedPassword = await this.authRepository.encryptPassword(
      userPlainPassword.value,
    );
    const userEncryptedPassword = UserEncryptedPassword.with(hashedPassword);
    const userName = UserName.with(username);

    const userDb = await this.userFinder.findById(userId);
    if (!(userDb instanceof UserDTO)) {
      throw UserNotFoundError.withId(userId);
    }
    const userByEmail = await this.userFinder.findByEmail(userEmail);

    // si el usuario existe con mismo email y distinto id
    if (userByEmail && userByEmail.id != userDb.id) {
      throw UserAlreadyExistsError.withEmail(userEmail);
    }

    const user = new User(userId, userEmail, userEncryptedPassword, userName);
    await this.userRepository.update(user);
    return user;
  }
}
