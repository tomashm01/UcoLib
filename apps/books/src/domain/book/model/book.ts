import {
  BookId,
  BookBarCode,
  BookTitle,
  BookAuthor,
  BookGenre,
  BookStock,
  BookImage,
} from './index';

export class Book {
  private _bookId: BookId;
  private _barCode: BookBarCode;
  private _title: BookTitle;
  private _author: BookAuthor;
  private _genre: BookGenre;
  private _stock: BookStock;
  private _image: BookImage;

  constructor(
    bookId: BookId,
    barCode: BookBarCode,
    title: BookTitle,
    author: BookAuthor,
    genre: BookGenre,
    stock: BookStock,
    image: BookImage,
  ) {
    this._bookId = bookId;
    this._barCode = barCode;
    this._title = title;
    this._author = author;
    this._genre = genre;
    this._stock = stock;
    this._image = image;
  }

  public static add(
    bookId: BookId,
    barCode: BookBarCode,
    title: BookTitle,
    author: BookAuthor,
    genre: BookGenre,
    stock: BookStock,
    image: BookImage,
  ): Book {
    const book = new Book(bookId, barCode, title, author, genre, stock, image);
    return book;
  }

  get bookId(): BookId {
    return this._bookId;
  }

  get barCode(): BookBarCode {
    return this._barCode;
  }

  get title(): BookTitle {
    return this._title;
  }

  get author(): BookAuthor {
    return this._author;
  }

  get genre(): BookGenre {
    return this._genre;
  }

  get stock(): BookStock {
    return this._stock;
  }

  get image(): BookImage {
    return this._image;
  }
}
