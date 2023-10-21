import { CREATE_USER, CreateUser, USER_FINDER } from '../application';
import { USER_REPOSITORY } from '../domain/model';
import {
  USER_SERVICE,
  UserMongoFinder,
  UserMongoRepository,
  UserService,
} from './service';

export const UserProviders = [
  {
    provide: USER_FINDER,
    useClass: UserMongoFinder,
  },
  {
    provide: USER_REPOSITORY,
    useClass: UserMongoRepository,
  },
  {
    provide: USER_SERVICE,
    useClass: UserService,
  },
  {
    provide: CREATE_USER,
    useClass: CreateUser,
  },
];
