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

export const READ_BOOK_BARCODE = 'READ_BOOK_BARCODE';

@Injectable()
export class ReadBookByBarcode {
  constructor(@Inject(BOOK_FINDER) private readonly bookFinder: BookFinder) {}

  async execute(barcode: string): Promise<Book> {
    const bookBarCode: BookBarCode = BookBarCode.with(barcode);
    const bookDto: BookDTO = await this.bookFinder.findByIsbn(bookBarCode);
    if (!bookDto) throw BookNotFoundError.withBarCode(bookBarCode);

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
