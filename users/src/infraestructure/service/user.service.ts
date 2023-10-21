import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/model';
import { UserDTO } from 'src/utils';
import { CREATE_USER, CreateUser } from 'src/application';
import { UPDATE_USER, UpdateUser } from 'src/application/update-user';
import { DELETE_USER, DeleteUser } from 'src/application/delete-user';
import { READ_USER, ReadUser } from 'src/application/read-user';

export const USER_SERVICE = 'USER_SERVICE';

@Injectable()
export class UserService {
  constructor(
    @Inject(CREATE_USER) private readonly createUseCase: CreateUser,
    @Inject(UPDATE_USER) private readonly updateUseCase: UpdateUser,
    @Inject(DELETE_USER) private readonly deleteUseCase: DeleteUser,
    @Inject(READ_USER) private readonly readUseCase: ReadUser,
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

  async readUser(id: string): Promise<UserDTO> {
    const user: User = await this.readUseCase.execute(id);
    return new UserDTO({
      id: user.id.value,
      email: user.email.value,
      password: user.password.value,
      name: user.name.value,
    });
  }

  async updateUser(userdto: UserDTO): Promise<UserDTO> {
    const user: User = await this.updateUseCase.execute(
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

  async deleteUser(id: string): Promise<void> {
    await this.deleteUseCase.execute(id);
  }
}
