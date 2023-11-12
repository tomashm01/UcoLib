import { Inject, Injectable } from '@nestjs/common';
import { BOOK_FINDER, BookFinder } from './service/book-finder.service';
import {
  BOOK_REPOSITORY,
  BookId,
  BookNotFoundError,
  BookRepository,
} from '../../../src/domain';
import { BookDTO } from '../../../src/utils';

export const DELETE_BOOK = 'DELETE_BOOK';
@Injectable()
export class DeleteBook {
  constructor(
    @Inject(BOOK_FINDER) private readonly bookFinder: BookFinder,
    @Inject(BOOK_REPOSITORY) private readonly bookRepository: BookRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const bookId: BookId = BookId.with(id);
    if (!((await this.bookFinder.findById(bookId)) instanceof BookDTO)) {
      throw BookNotFoundError.withId(bookId);
    }
    await this.bookRepository.delete(bookId);
  }
}
