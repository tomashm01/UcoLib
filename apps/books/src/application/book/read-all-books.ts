import { Inject, Injectable } from '@nestjs/common';
import { BOOK_FINDER, BookFinder } from './service/book-finder.service';
import {
  Book,
  BookAuthor,
  BookBarCode,
  BookGenre,
  BookId,
  BookImage,
  BookStock,
  BookTitle,
} from '../../../src/domain';
import { BookDTO } from '../../../src/utils';

export const READ_ALL_BOOKS = 'READ_ALL_BOOKS';

@Injectable()
export class ReadAllBooks {
  constructor(@Inject(BOOK_FINDER) private readonly bookFinder: BookFinder) {}

  async execute(): Promise<Book[]> {
    const booksDto: BookDTO[] = await this.bookFinder.findAll();
    return booksDto.map((bookDto) => {
      return new Book(
        BookId.with(bookDto.id),
        BookBarCode.with(bookDto.barCode),
        BookTitle.with(bookDto.title),
        BookAuthor.with(bookDto.author),
        BookGenre.with(bookDto.genre),
        BookStock.with(bookDto.stock),
        BookImage.with(bookDto.image),
      );
    });
  }
}
