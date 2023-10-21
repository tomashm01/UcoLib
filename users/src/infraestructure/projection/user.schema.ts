import { Document, Schema } from 'mongoose';
import { User } from '../../domain/model';

export const USER_PROJECTION = 'users';

export type UserDocument = User & Document;

export const UserSchema = new Schema(
  {
    _id: String,
    email: { type: String, index: { unique: true } },
    password: String,
    name: String,
  },
  {
    versionKey: false,
  },
);
