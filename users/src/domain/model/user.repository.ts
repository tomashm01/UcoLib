import { User } from './user';
import { UserId } from './user-id';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepository {
  save(user: User): Promise<void>;
  update(use: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}
