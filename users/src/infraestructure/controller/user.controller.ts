import {
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
  Req,
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
    @Req() request: any,
  ): Promise<UserDTO | null> {
    const jwt = this.extractJWTFromRequest(request);

    if (!this.authService.verifyToken(jwt)) {
      throw new UnauthorizedException('Invalid token');
    }

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
  async create(@Body() userDto: UserDTO, @Req() request: any): Promise<void> {
    const jwt = this.extractJWTFromRequest(request);

    if (!this.authService.verifyToken(jwt)) {
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
  async login(@Body() userDto: LoginUserDTO): Promise<LoginUserResponse> {
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
    @Req() request: any,
  ): Promise<UserDTO> {
    const jwt = this.extractJWTFromRequest(request);

    if (!this.authService.verifyToken(jwt)) {
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
  async delete(@Param('id') id: string, @Req() request: any): Promise<string> {
    const jwt = this.extractJWTFromRequest(request);

    if (!this.authService.verifyToken(jwt)) {
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
  async findAll(@Req() request: any): Promise<ReadAllResponse> {
    const jwt = this.extractJWTFromRequest(request);

    if (!this.authService.verifyToken(jwt)) {
      throw new UnauthorizedException('Invalid token');
    }
    const users: UserProps[] = await this.userService.readAllUsers();
    return new ReadAllResponse({ users });
  }

  private extractJWTFromRequest(request: any): string {
    const jwt = request.headers.authorization;
    if (jwt?.includes('Bearer')) {
      return jwt.split(' ')[1];
    }
    throw new UnauthorizedException('JWT must be provided');
  }
}
