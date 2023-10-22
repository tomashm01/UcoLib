import { Inject, Injectable } from '@nestjs/common';

import {
  UserPlainPassword,
  UserEmail,
  USER_REPOSITORY,
  UserRepository,
  User,
  UserId,
  UserEncryptedPassword,
  UserName,
  UserAlreadyExistsError,
  AUTH_REPOSITORY,
  AuthRepository,
} from '../../domain';
import { UserDTO } from 'src/utils';
import { USER_FINDER, UserFinder } from './service/user-finder.service';

export const CREATE_USER = 'CREATE_USER';

@Injectable()
export class CreateUser {
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

    if ((await this.userFinder.findById(userId)) instanceof UserDTO) {
      throw UserAlreadyExistsError.withId(userId);
    }

    if ((await this.userFinder.findByEmail(userEmail)) instanceof UserDTO) {
      throw UserAlreadyExistsError.withEmail(userEmail);
    }

    const user = User.add(userId, userEmail, userEncryptedPassword, userName);
    await this.userRepository.save(user);
    return user;
  }
}
