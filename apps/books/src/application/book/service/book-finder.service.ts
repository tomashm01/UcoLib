import { BookAuthor, BookBarCode, BookId } from '../../../../src/domain';
import { BookDTO } from '../../../../src/utils';

export const BOOK_FINDER = 'BOOK_FINDER';

export interface BookFinder {
  findAll(): Promise<BookDTO[]>;
  findByAuthor(author: BookAuthor): Promise<BookDTO | null>;
  findByIsbn(isbn: BookBarCode): Promise<BookDTO | null>;
  findById(id: BookId): Promise<BookDTO | null>;
}
