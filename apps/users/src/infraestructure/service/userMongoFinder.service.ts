import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserFinder } from '../../application/user/service/user-finder.service';
import { USER_PROJECTION, UserDocument } from '../projection';

import { UserDTO } from '../../../src/utils';
import { UserEmail, UserId } from '../../../src/domain/user/model';

@Injectable()
export class UserMongoFinder implements UserFinder {
  constructor(
    @InjectModel(USER_PROJECTION) private readonly model: Model<UserDocument>,
  ) {}

  async findAll(): Promise<UserDTO[]> {
    const users = await this.model.find().exec();
    return users.map(
      (user) =>
        new UserDTO({
          id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
        }),
    );
  }
  async findByEmail(email: UserEmail): Promise<UserDTO> {
    const user = await this.model.findOne({ email: email.value }).exec();
    if (!user) {
      return null;
    }
    return new UserDTO({
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    });
  }
  async findById(id: UserId): Promise<UserDTO> {
    const user = await this.model.findById(id.value).exec();
    if (!user) {
      return null;
    }
    const userDto: UserDTO = new UserDTO({
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    });
    return userDto;
  }
}
