import {
  Headers,
  Body,
  ConflictException,
  Controller,
  Delete,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../../domain/user/exception';
import { AuthService, USER_SERVICE, UserService } from '../service';
import { LoginUserDTO, UserDTO } from 'src/utils';
import { LoginUserResponse } from 'src/utils/user/LoginUserResponse';
import { ReadAllResponse, UserProps } from 'src/utils/user/ReadAllResponse';
import { AUTH_REPOSITORY } from 'src/domain';

@ApiTags('UserController')
@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserService,
    @Inject(AUTH_REPOSITORY) private readonly authService: AuthService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por id' })
  @ApiOkResponse({ type: UserDTO })
  @ApiBearerAuth()
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') jwt: string,
  ): Promise<UserDTO | null> {
    const isTokenValid = await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      const user: UserDTO = await this.userService.readUser(id);
      return user;
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw new NotFoundException(e.message);
      } else {
        throw e;
      }
    }
  }

  @Post('/register')
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiBody({ type: UserDTO })
  @ApiOkResponse({ type: UserDTO })
  @ApiBearerAuth()
  async create(
    @Body() userDto: UserDTO,
    @Headers('authorization') jwt: string,
  ): Promise<void> {
    const isTokenValid = await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      await this.userService.createUser(userDto);
      return;
    } catch (e) {
      if (e instanceof UserAlreadyExistsError) {
        throw new ConflictException(e.message);
      } else {
        throw e;
      }
    }
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login de un usuario' })
  @ApiBody({ type: LoginUserDTO })
  @ApiOkResponse({ type: LoginUserDTO })
  @ApiBearerAuth()
  async login(
    @Body() userDto: LoginUserDTO,
    @Headers('authorization') jwt: string,
  ): Promise<LoginUserResponse> {
    const isTokenValid = await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      return await this.userService.loginUser(userDto);
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw new ConflictException(e.message);
      } else {
        throw e;
      }
    }
  }

  @Patch()
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiBody({ type: UserDTO })
  @ApiOkResponse({ type: UserDTO })
  @ApiBearerAuth()
  async update(
    @Body() userDto: UserDTO,
    @Headers('authorization') jwt: string,
  ): Promise<UserDTO> {
    const isTokenValid = await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      return await this.userService.updateUser(userDto);
    } catch (e) {
      if (e instanceof UserAlreadyExistsError) {
        throw new ConflictException(e.message);
      } else {
        throw e;
      }
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por id' })
  @ApiOkResponse()
  @ApiBearerAuth()
  async delete(
    @Param('id') id: string,
    @Headers('authorization') jwt: string,
  ): Promise<string> {
    const isTokenValid = await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      await this.userService.deleteUser(id);
      return 'User <' + id + '> deleted ';
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw new NotFoundException(e.message);
      } else {
        throw e;
      }
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiOkResponse({ type: UserDTO })
  @ApiBearerAuth()
  async findAll(
    @Headers('authorization') jwt: string,
  ): Promise<ReadAllResponse> {
    const isTokenValid = await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    const users: UserProps[] = await this.userService.readAllUsers();
    return {
      jwt,
      users,
    };
  }
}
