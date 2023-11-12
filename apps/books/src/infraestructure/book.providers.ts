import { BOOK_REPOSITORY } from '../../src/domain';
import {
  AUTH_SERVICE,
  AuthService,
  BOOK_SERVICE,
  BookMongoFinder,
  BookMongoRepository,
  BookService,
} from './service';
import {
  BOOK_FINDER,
  CREATE_BOOK,
  CreateBook,
  DELETE_BOOK,
  DeleteBook,
  READ_ALL_BOOKS,
  READ_BOOK,
  ReadAllBooks,
  ReadBook,
  UPDATE_BOOK,
  UpdateBook,
} from '../../src/application';

export const BookProviders = [
  {
    provide: BOOK_FINDER,
    useClass: BookMongoFinder,
  },
  {
    provide: BOOK_REPOSITORY,
    useClass: BookMongoRepository,
  },
  {
    provide: BOOK_SERVICE,
    useClass: BookService,
  },
  {
    provide: CREATE_BOOK,
    useClass: CreateBook,
  },
  {
    provide: UPDATE_BOOK,
    useClass: UpdateBook,
  },
  {
    provide: DELETE_BOOK,
    useClass: DeleteBook,
  },
  {
    provide: READ_BOOK,
    useClass: ReadBook,
  },
  {
    provide: READ_ALL_BOOKS,
    useClass: ReadAllBooks,
  },
  {
    provide: AUTH_SERVICE,
    useClass: AuthService,
  },
];
