import { Inject, Injectable } from '@nestjs/common';
import { UserId } from '../domain/model/user-id';
import { USER_FINDER, UserFinder } from './service/user-finder.service';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../domain/model/user.repository';
import { UserNotFoundError } from '../domain/exception/user-not-found.error';
import { UserDTO } from '../utils/user/UserDTO';

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
