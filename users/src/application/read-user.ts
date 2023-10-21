import { UserDTO } from 'src/utils';
import { USER_FINDER, UserFinder } from './service/user-finder.service';
import {
  User,
  UserEmail,
  UserId,
  UserName,
  UserPassword,
} from 'src/domain/model';
import { Inject, Injectable } from '@nestjs/common';

export const READ_USER = 'READ_USER';

@Injectable()
export class ReadUser {
  constructor(@Inject(USER_FINDER) private readonly userFinder: UserFinder) {}

  async execute(id: string): Promise<User> {
    const userId: UserId = UserId.with(id);
    const userDto: UserDTO = await this.userFinder.findById(userId);
    const user = new User(
      UserId.with(userDto.id),
      UserEmail.with(userDto.email),
      UserPassword.with(userDto.password),
      UserName.with(userDto.name),
    );
    return user;
  }
}
