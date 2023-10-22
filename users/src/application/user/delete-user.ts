import { Inject, Injectable } from '@nestjs/common';

import { UserDTO } from '../../utils/user/UserDTO';
import { USER_FINDER, UserFinder } from './service/user-finder.service';
import {
  USER_REPOSITORY,
  UserId,
  UserNotFoundError,
  UserRepository,
} from 'src/domain';

export const DELETE_USER = 'DELETE_USER';
@Injectable()
export class DeleteUser {
  constructor(
    @Inject(USER_FINDER) private readonly userFinder: UserFinder,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const userId: UserId = UserId.with(id);
    if (!((await this.userFinder.findById(userId)) instanceof UserDTO)) {
      throw UserNotFoundError.withId(userId);
    }
    await this.userRepository.delete(userId);
  }
}
