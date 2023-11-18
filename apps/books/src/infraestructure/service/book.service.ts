import { Inject, Injectable } from '@nestjs/common';
import {
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
  READ_BOOK_BARCODE,
  ReadBookByBarcode,
  DELETE_STOCK,
  DeleteStock
} from '../../../src/application';
import { Book, BookStock } from '../../../src/domain';
import { BookDTO } from '../../../src/utils';
import { CreateBookDTO } from '../../utils/book/CreateBookDTO';


export const BOOK_SERVICE = 'BOOK_SERVICE';

@Injectable()
export class BookService {
  constructor(
    @Inject(CREATE_BOOK) private readonly createUseCase: CreateBook,
    @Inject(UPDATE_BOOK) private readonly updateUseCase: UpdateBook,
    @Inject(DELETE_BOOK) private readonly deleteUseCase: DeleteBook,
    @Inject(READ_BOOK) private readonly readUseCase: ReadBook,
    @Inject(READ_BOOK_BARCODE) private readonly readUseCaseByBarcode: ReadBookByBarcode,
    @Inject(DELETE_STOCK) private readonly deleteStockUseCase: DeleteStock,
    @Inject(READ_ALL_BOOKS) private readonly readAllUseCase: ReadAllBooks,
  ) {}

  async createBook(bookdto: CreateBookDTO): Promise<BookDTO> {
    const book: Book = await this.createUseCase.execute(
      bookdto.id,
      bookdto.barCode,
      bookdto.title,
      bookdto.author,
      bookdto.genre,
      bookdto.image,
    );

    return new BookDTO({
      id: book.bookId.value,
      barCode: book.barCode.value,
      title: book.title.value,
      author: book.author.value,
      genre: book.genre.value,
      stock: book.stock.value,
      image: book.image.value,
    });
  }

  async readBook(id: string): Promise<BookDTO> {
    const book: Book = await this.readUseCase.execute(id);

    return new BookDTO({
      id: book.bookId.value,
      barCode: book.barCode.value,
      title: book.title.value,
      author: book.author.value,
      genre: book.genre.value,
      stock: book.stock.value,
      image: book.image.value,
    });
  }

  async readBookByBarcode(barcode: string): Promise<BookDTO> {
    const book: Book = await this.readUseCaseByBarcode.execute(barcode);

    return new BookDTO({
      id: book.bookId.value,
      barCode: book.barCode.value,
      title: book.title.value,
      author: book.author.value,
      genre: book.genre.value,
      stock: book.stock.value,
      image: book.image.value,
    });
  }

  async updateBook(barcode: string): Promise<BookDTO> {
    const book: Book = await this.readUseCaseByBarcode.execute(barcode);

    await this.updateUseCase.execute(
      book.bookId.value,
      book.barCode.value,
      book.title.value,
      book.author.value,
      book.genre.value,
      book.stock.value + 1,
      book.image.value,
      );

    return new BookDTO({
      id: book.bookId.value,
      barCode: book.barCode.value,
      title: book.title.value,
      author: book.author.value,
      genre: book.genre.value,
      stock: book.stock.value+1,
      image: book.image.value,
    });
  }

  async deleteBook(id: string): Promise<void> {
    await this.deleteUseCase.execute(id);
  }

  async deleteStock(barcode: string): Promise<void> {
    await this.deleteStockUseCase.execute(barcode);
  }


  async readAllBooks(): Promise<BookDTO[]> {
    const books: Book[] = await this.readAllUseCase.execute();
    return books.map((book) => {
      return new BookDTO({
        id: book.bookId.value,
        barCode: book.barCode.value,
        title: book.title.value,
        author: book.author.value,
        genre: book.genre.value,
        stock: book.stock.value,
        image: book.image.value,
      });
    });
  }
}
