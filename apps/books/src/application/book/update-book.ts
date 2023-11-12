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

export const UPDATE_BOOK = 'UPDATE_BOOK';

@Injectable()
export class UpdateBook {
  constructor(
    @Inject(BOOK_FINDER) private readonly bookFinder: BookFinder,
    @Inject(BOOK_REPOSITORY) private readonly bookRepository: BookRepository,
  ) {}

  async execute(
    id: string,
    barCode: string,
    title: string,
    author: string,
    genre: string,
    stock: number,
    image: string,
  ): Promise<Book> {
    const bookId: BookId = BookId.with(id);
    const bookBarCode: BookBarCode = BookBarCode.with(barCode);
    const bookTitle: BookTitle = BookTitle.with(title);
    const bookAuthor: BookAuthor = BookAuthor.with(author);
    const bookGenre: BookGenre = BookGenre.with(genre);
    const bookStock: BookStock = BookStock.with(stock);
    const bookImage: BookImage = BookImage.with(image);

    const bookDb = await this.bookFinder.findByIsbn(bookBarCode);
    if (!(bookDb instanceof BookDTO)) {
      throw BookNotFoundError.withBarCode(bookBarCode);
    }

    const book = Book.add(
      bookId,
      bookBarCode,
      bookTitle,
      bookAuthor,
      bookGenre,
      bookStock,
      bookImage,
    );

    await this.bookRepository.update(book);
    return book;
  }
}
