import { Inject, Injectable } from '@nestjs/common';

import { UserDTO } from 'src/utils';
import { USER_FINDER, UserFinder } from './service/user-finder.service';
import {
  User,
  UserEmail,
  UserEncryptedPassword,
  UserId,
  UserName,
} from 'src/domain/user/model';
import { UserNotFoundError } from 'src/domain/user/exception/user-not-found.error';

export const READ_USER = 'READ_USER';

@Injectable()
export class ReadUser {
  constructor(@Inject(USER_FINDER) private readonly userFinder: UserFinder) {}

  async execute(id: string): Promise<User> {
    const userId: UserId = UserId.with(id);
    const userDto: UserDTO = await this.userFinder.findById(userId);
    if (!userDto) throw UserNotFoundError.withId(userId);
    const user = new User(
      UserId.with(userDto.id),
      UserEmail.with(userDto.email),
      UserEncryptedPassword.with(userDto.password),
      UserName.with(userDto.name),
    );
    return user;
  }
}
