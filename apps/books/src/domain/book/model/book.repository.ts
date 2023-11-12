import { Book } from './book';
import { BookId } from './book-id';

export const BOOK_REPOSITORY = 'BOOK_REPOSITORY';

export interface BookRepository {
  save(user: Book): Promise<void>;
  update(use: Book): Promise<void>;
  delete(id: BookId): Promise<void>;
}
