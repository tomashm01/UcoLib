import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user/model/user.repository';
import { User, UserId } from '../../domain/user/model';
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
    await this.model.findByIdAndUpdate(user.id.value, {
      email: user.email.value,
      password: user.password.value,
      name: user.name.value,
    });
  }

  async delete(id: UserId): Promise<void> {
    await this.model.deleteOne({ _id: id.value });
  }
}
