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
  BookRepository,
  BookStock,
  BookTitle,
} from '../../../src/domain';
import { BookDTO } from '../../../src/utils';

export const CREATE_BOOK = 'CREATE_BOOK';

@Injectable()
export class CreateBook {
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
    image: string,
  ): Promise<Book> {
    const bookId: BookId = BookId.with(id);
    const bookBarCode: BookBarCode = BookBarCode.with(barCode);
    const bookTitle: BookTitle = BookTitle.with(title);
    const bookAuthor: BookAuthor = BookAuthor.with(author);
    const bookGenre: BookGenre = BookGenre.with(genre);
    const bookImage: BookImage = BookImage.with(image);

    const bookDb = await this.bookFinder.findByIsbn(bookBarCode);

    const bookStock: BookStock =
      bookDb instanceof BookDTO
        ? BookStock.with(1 + bookDb.stock)
        : BookStock.with(1);

    const book = Book.add(
      bookId,
      bookBarCode,
      bookTitle,
      bookAuthor,
      bookGenre,
      bookStock,
      bookImage,
    );

    bookDb instanceof BookDTO
      ? await this.bookRepository.update(book)
      : await this.bookRepository.save(book);

    return book;
  }
}
