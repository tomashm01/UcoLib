import { User } from './user';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepository {
  save(user: User): Promise<void>;
  update(use: User): Promise<void>;
}
