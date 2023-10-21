import { Inject, Injectable } from '@nestjs/common';

import { UserPassword } from '../domain/model/user-password';
import { UserEmail } from '../domain/model/user-email';
import { UserId } from '../domain/model/user-id';
import { USER_FINDER, UserFinder } from './service/user-finder.service';
import { User } from '../domain/model/user';
import { UserName } from '../domain/model/user-name';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../domain/model/user.repository';
import { UserNotFoundError } from 'src/domain/exception';
import { UserDTO } from 'src/utils';

export const UPDATE_USER = 'UPDATE_USER';

@Injectable()
export class UpdateUser {
  constructor(
    @Inject(USER_FINDER) private readonly userFinder: UserFinder,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(
    id: string,
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    const userId: UserId = UserId.with(id);
    const userEmail = UserEmail.with(email);
    const userPassword = UserPassword.with(password);
    const userName = UserName.with(username);

    if (!((await this.userFinder.findById(userId)) instanceof UserDTO)) {
      throw UserNotFoundError.withId(userId);
    }

    const user = new User(userId, userEmail, userPassword, userName);
    await this.userRepository.update(user);
    return user;
  }
}
