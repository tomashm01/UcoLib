import { Inject, Injectable } from '@nestjs/common';
import { BOOK_FINDER, BookFinder } from './service/book-finder.service';
import {
  BOOK_REPOSITORY,
  Book,
  BookAuthor,
  BookBarCode,
  BookGenre,
  BookId,
  BookImage,
  BookNotFoundError,
  BookRepository,
  BookStock,
  BookTitle,
} from '../../../src/domain';
import { BookDTO } from '../../../src/utils';

export const DELETE_STOCK = 'DELETE_STOCK';

@Injectable()
export class DeleteStock {
  constructor(
    @Inject(BOOK_FINDER) private readonly bookFinder: BookFinder,
    @Inject(BOOK_REPOSITORY) private readonly bookRepository: BookRepository,
  ) {}

  async execute(
    barCode: string,
  ): Promise<Book> {
    const bookBarCode: BookBarCode = BookBarCode.with(barCode);

    const bookDb = await this.bookFinder.findByIsbn(bookBarCode);
    if (!(bookDb instanceof BookDTO)) {
      throw BookNotFoundError.withBarCode(bookBarCode);
    }

    bookDb.stock = bookDb.stock - 1;

    const book = Book.add(
      BookId.with(bookDb.id),
      BookBarCode.with(bookDb.barCode),
      BookTitle.with(bookDb.title),
      BookAuthor.with(bookDb.author),
      BookGenre.with(bookDb.genre),
      BookStock.with(bookDb.stock),
      BookImage.with(bookDb.image),
    );

    await this.bookRepository.update(book);
    return book;
  }
}
