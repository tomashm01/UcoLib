import { Inject, Injectable } from '@nestjs/common';

import { UserDTO } from '../../../src/utils';
import { USER_FINDER, UserFinder } from './service/user-finder.service';
import {
  User,
  UserEmail,
  UserEncryptedPassword,
  UserId,
  UserName,
} from '../../../src/domain/user/model';

export const READ_ALL_USERS = 'READ_ALL_USERS';

@Injectable()
export class ReadAllUsers {
  constructor(@Inject(USER_FINDER) private readonly userFinder: UserFinder) {}

  async execute(): Promise<User[]> {
    const usersDto: UserDTO[] = await this.userFinder.findAll();
    return usersDto.map((userDto) => {
      return new User(
        UserId.with(userDto.id),
        UserEmail.with(userDto.email),
        UserEncryptedPassword.with(userDto.password),
        UserName.with(userDto.name),
      );
    });
  }
}
