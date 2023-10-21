import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/model/user.repository';
import { User } from '../../domain/model';
import { InjectModel } from '@nestjs/mongoose';
import { USER_PROJECTION, UserDocument } from '../projection';
import { Model } from 'mongoose';

@Injectable()
export class UserMongoRepository implements UserRepository {
  constructor(
    @InjectModel(USER_PROJECTION) private readonly model: Model<UserDocument>,
  ) {}

  async save(user: User): Promise<void> {
    await this.model.create({
      _id: user.id.value,
      email: user.email.value,
      password: user.password.value,
      name: user.name.value,
    });
  }

  async update(user: User): Promise<void> {
    await this.model.updateOne({ id: user.id }, user);
  }
}
