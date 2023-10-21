import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/model';
import { UserDTO } from 'src/utils';
import { CREATE_USER, CreateUser } from 'src/application';

export const USER_SERVICE = 'USER_SERVICE';

@Injectable()
export class UserService {
  constructor(
    @Inject(CREATE_USER) private readonly createUseCase: CreateUser,
  ) {}

  async createUser(userdto: UserDTO): Promise<UserDTO> {
    const user: User = await this.createUseCase.execute(
      userdto.id,
      userdto.email,
      userdto.password,
      userdto.name,
    );
    return new UserDTO({
      id: user.id.value,
      email: user.email.value,
      password: user.password.value,
      name: user.name.value,
    });
  }
}
