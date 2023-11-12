import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BookFinder } from '../../../src/application';
import { BOOK_PROJECTION, BookDocument } from '../projection';
import { BookDTO } from '../../../src/utils';
import { BookAuthor, BookBarCode, BookId } from '../../../src/domain';

@Injectable()
export class BookMongoFinder implements BookFinder {
  constructor(
    @InjectModel(BOOK_PROJECTION) private readonly model: Model<BookDocument>,
  ) {}

  async findByIsbn(isbn: BookBarCode): Promise<BookDTO> {
    const book = (
      await this.model.findOne({ barCode: isbn.value }).exec()
    ).toObject();
    if (!book) {
      return null;
    }
    return new BookDTO({
      id: book._id,
      ...book,
    });
  }

  async findAll(): Promise<BookDTO[]> {
    const books = await this.model.find().exec();

    return books.map((book) => {
      const bookObject = book.toObject();
      return new BookDTO({
        id: book._id,
        ...bookObject,
      });
    });
  }

  async findByAuthor(author: BookAuthor): Promise<BookDTO> {
    const book = (
      await this.model.findOne({ author: author.value }).exec()
    ).toObject();
    if (!book) {
      return null;
    }
    return new BookDTO({
      id: book._id,
      ...book,
    });
  }
  async findById(id: BookId): Promise<BookDTO> {
    const book = (await this.model.findById(id.value).exec()).toObject();

    if (!book) {
      return null;
    }
    return new BookDTO({
      id: book._id,
      ...book,
    });
  }
}
