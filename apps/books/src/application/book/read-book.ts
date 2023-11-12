import { Inject, Injectable } from '@nestjs/common';
import { BOOK_FINDER, BookFinder } from './service/book-finder.service';
import {
  Book,
  BookAuthor,
  BookBarCode,
  BookGenre,
  BookId,
  BookImage,
  BookNotFoundError,
  BookStock,
  BookTitle,
} from '../../../src/domain';
import { BookDTO } from '../../../src/utils';

export const READ_BOOK = 'READ_BOOK';

@Injectable()
export class ReadBook {
  constructor(@Inject(BOOK_FINDER) private readonly bookFinder: BookFinder) {}

  async execute(id: string): Promise<Book> {
    const bookId: BookId = BookId.with(id);
    const bookDto: BookDTO = await this.bookFinder.findById(bookId);
    if (!bookDto) throw BookNotFoundError.withId(bookId);

    return new Book(
      BookId.with(bookDto.id),
      BookBarCode.with(bookDto.barCode),
      BookTitle.with(bookDto.title),
      BookAuthor.with(bookDto.author),
      BookGenre.with(bookDto.genre),
      BookStock.with(bookDto.stock),
      BookImage.with(bookDto.image),
    );
  }
}
