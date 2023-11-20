import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookId, BookRepository } from '../../../src/domain';
import { BOOK_PROJECTION, BookDocument } from '../projection';

@Injectable()
export class BookMongoRepository implements BookRepository {
  constructor(
    @InjectModel(BOOK_PROJECTION) private readonly model: Model<BookDocument>,
  ) {}

  async save(book: Book): Promise<void> {
    await this.model.create({
      _id: book.bookId.value,
      title: book.title.value,
      barCode: book.barCode.value,
      author: book.author.value,
      genre: book.genre.value,
      stock: book.stock.value,
      image: book.image.value,
    });
  }

  async update(book: Book): Promise<void> {
    await this.model.findByIdAndUpdate(book.bookId.value, {
      _id: book.bookId.value,
      title: book.title.value,
      barCode: book.barCode.value,
      author: book.author.value,
      genre: book.genre.value,
      stock: book.stock.value,
      image: book.image.value,
    });
  }

  async delete(id: BookId): Promise<void> {
    await this.model.deleteOne({ _id: id.value });
  }

  async deleteAll(): Promise<void> {
    await this.model.deleteMany({});
  }
}
