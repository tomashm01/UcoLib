import { CREATE_USER, CreateUser, USER_FINDER } from '../application';
import { READ_USER, ReadUser } from 'src/application/read-user';
import { UPDATE_USER, UpdateUser } from 'src/application/update-user';
import { DELETE_USER, DeleteUser } from 'src/application/delete-user';
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
  {
    provide: UPDATE_USER,
    useClass: UpdateUser,
  },
  {
    provide: DELETE_USER,
    useClass: DeleteUser,
  },
  {
    provide: READ_USER,
    useClass: ReadUser,
  },
];
