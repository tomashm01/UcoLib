import { Inject, Injectable } from '@nestjs/common';

import { UserDTO } from 'src/utils';
import {
  CREATE_USER,
  CreateUser,
  LOGIN_USER,
  UPDATE_USER,
  UpdateUser,
  DELETE_USER,
  DeleteUser,
  READ_USER,
  ReadUser,
  LoginUser,
} from 'src/application/user';
import {
  AUTH_REPOSITORY,
  AuthRepository,
  User,
  UserEmail,
  UserId,
} from 'src/domain';
import { LoginUserDTO } from 'src/utils/user/LoginUserDTO';

export const USER_SERVICE = 'USER_SERVICE';

@Injectable()
export class UserService {
  constructor(
    @Inject(CREATE_USER) private readonly createUseCase: CreateUser,
    @Inject(UPDATE_USER) private readonly updateUseCase: UpdateUser,
    @Inject(DELETE_USER) private readonly deleteUseCase: DeleteUser,
    @Inject(READ_USER) private readonly readUseCase: ReadUser,
    @Inject(LOGIN_USER) private readonly loginUseCase: LoginUser,
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
  ) {}

  async createUser(userdto: UserDTO): Promise<string> {
    const user: User = await this.createUseCase.execute(
      userdto.id,
      userdto.email,
      userdto.password,
      userdto.name,
    );
    return await this.authRepository.createToken(user.id, user.email);
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

  async loginUser(userdto: LoginUserDTO): Promise<string> {
    const user: UserDTO = await this.loginUseCase.execute(
      userdto.email,
      userdto.password,
    );
    return await this.authRepository.createToken(
      UserId.with(user.id),
      UserEmail.with(user.email),
    );
  }
}
