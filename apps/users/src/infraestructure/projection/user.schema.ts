import { Document, Schema } from 'mongoose';
import { UserDTO } from '../../../src/utils';

export const USER_PROJECTION = 'users';

export type UserDocument = UserDTO & Document;

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
