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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';

import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../../domain/user/exception';
import { USER_SERVICE, UserService } from '../service';
import { LoginUserDTO, UserDTO } from 'src/utils';
import { LoginUserResponse } from 'src/utils/user/LoginUserResponse';

@ApiTags('UserController')
@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) {}

  /*
  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiOkResponse({ type: UserDTO })
  async findAll(): Promise<UserDTO[] | null> {
    return null;
    
  }

  */

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por id' })
  @ApiOkResponse({ type: UserDTO })
  async findOne(@Param('id') id: string): Promise<UserDTO | null> {
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
  async create(@Body() userDto: UserDTO): Promise<void> {
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
  async update(@Body() userDto: UserDTO): Promise<UserDTO> {
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
  async delete(@Param('id') id: string): Promise<string> {
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
  async findAll(): Promise<UserDTO[] | null> {
    return;
  }
  /*
  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<TokenResponse> {
    const { email, password } = loginDTO;

    const user: UserDTO = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Login failed');
    }

    const isValidPassword = await this.authService.validatePassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Login failed');
    }

    return new TokenResponse(await this.authService.generateToken(user.id));
  }

  @Post('validate-token')
  @ApiOperation({ summary: 'Validar el token del usuario' })
  @ApiBody({ type: TokenResponse })
  async validateToken(@Body() token: TokenResponse): Promise<RoleResponse> {
    const userId: UserId = await this.authService.validateToken(token.token);

    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    return new RoleResponse(
      (await this.userService.getUserById(userId.value)).role,
      userId.value
    );
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Cambiar la contraseña del usuario' })
  @ApiOkResponse({ type: ChangePasswordRequestDTO })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordRequestDTO
  ): Promise<ChangePasswordResponse> {
    const { token, password, newpassword } = changePasswordDto;
    try {
      const userId: UserId = await this.authService.validateToken(token);
      const user: UserDTO = await this.userService.getUserById(userId.value);
      const isValidPassword = await this.authService.validatePassword(
        password,
        user.password
      );

      if (!isValidPassword) {
        throw new ForbiddenException('Contraseña incorrecta');
      }

      const newHashedPassword = await this.authService.hashPassword(
        newpassword
      );
      await this.userService.updateUserPassword(userId, newHashedPassword);
    } catch (e) {
      if (e instanceof ForbiddenException) {
        throw e;
      } else {
        throw new UnauthorizedException(e.message);
      }
    }
    return {
      token: token,
      message: 'Contraseña cambiada correctamente'
    };
  }
  */
}
