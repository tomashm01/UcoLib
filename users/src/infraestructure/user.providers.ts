import {
  USER_FINDER,
  CREATE_USER,
  CreateUser,
  LOGIN_USER,
  LoginUser,
  UPDATE_USER,
  UpdateUser,
  DELETE_USER,
  DeleteUser,
  READ_USER,
  ReadUser,
} from '../application';
import { USER_REPOSITORY, AUTH_REPOSITORY } from '../domain';
import {
  AuthService,
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
  {
    provide: AUTH_REPOSITORY,
    useClass: AuthService,
  },
  {
    provide: LOGIN_USER,
    useClass: LoginUser,
  },
];
