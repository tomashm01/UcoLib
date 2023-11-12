import { Document, Schema } from 'mongoose';
import { BookDTO } from '../../../src/utils';

export const BOOK_PROJECTION = 'books';

export type BookDocument = BookDTO & Document;

export const BookSchema = new Schema(
  {
    _id: String,
    barCode: { type: String, index: { unique: true } },
    title: String,
    author: String,
    genre: String,
    stock: Number,
    image: String,
  },
  {
    versionKey: false,
  },
);
