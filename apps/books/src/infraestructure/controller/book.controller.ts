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
import { AUTH_SERVICE, AuthService, BOOK_SERVICE, BookService } from '../service';
import { BookDTO } from '../../../src/utils';
import { BookNotFoundError } from '../../../src/domain';

@ApiTags('BookController')
@Controller('book')
export class BookController {
  constructor(
    @Inject(BOOK_SERVICE) private readonly bookService: BookService,
    @Inject(AUTH_SERVICE)private readonly authService: AuthService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un libro por id' })
  @ApiOkResponse({ type: BookDTO })
  @ApiBearerAuth()
  async findOne(
    @Param('id') id: string,
    //@Req() request: any,
  ): Promise<BookDTO | null> {
    /*const jwt = this.extractJWTFromRequest(request);

    if (!this.authService.verifyToken(jwt)) {
      throw new UnauthorizedException('Invalid token');
    }

    const isTokenValid = await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    */
    try {
      const book: BookDTO = await this.bookService.readBook(id);
      console.log(book)
      return book;
    } catch (e) {
      if (e instanceof BookNotFoundError) {
        throw new NotFoundException(e.message);
      } else {
        throw e;
      }
    }
  }

  @Post('/create')
  @ApiOperation({ summary: 'Crear un libro' })
  @ApiBody({ type: BookDTO })
  @ApiOkResponse({ type: BookDTO })
  @ApiBearerAuth()
  async create(
    @Body() BookDTO: BookDTO,
    //@Req() request: any,
  ): Promise<BookDTO> {
    /*const jwt = this.extractJWTFromRequest(request);

    if (!this.authService.verifyToken(jwt)) {
      throw new UnauthorizedException('Invalid token');
    }
    */
    return await this.bookService.createBook(BookDTO);
  }

  @Patch()
  @ApiOperation({ summary: 'Actualizar un libro' })
  @ApiBody({ type: BookDTO })
  @ApiOkResponse({ type: BookDTO })
  @ApiBearerAuth()
  async update(
    @Body() BookDTO: BookDTO,
    //@Req() request: any,
  ): Promise<BookDTO> {
    /*const jwt = this.extractJWTFromRequest(request);

    if (!this.authService.verifyToken(jwt)) {
      throw new UnauthorizedException('Invalid token');
    }
    */
    try {
      return await this.bookService.updateBook(BookDTO);
    } catch (e) {
      if (e instanceof BookNotFoundError) {
        throw new ConflictException(e.message);
      } else {
        throw e;
      }
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un libro por id' })
  @ApiOkResponse()
  @ApiBearerAuth()
  async delete(
    @Param('id') id: string /*@Req() request: any*/,
  ): Promise<string> {
    /*const jwt = this.extractJWTFromRequest(request);

    if (!this.authService.verifyToken(jwt)) {
      throw new UnauthorizedException('Invalid token');
    }
    */
    try {
      await this.bookService.deleteBook(id);
      return 'Book <' + id + '> deleted ';
    } catch (e) {
      if (e instanceof BookNotFoundError) {
        throw new NotFoundException(e.message);
      } else {
        throw e;
      }
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los libros' })
  @ApiOkResponse({ type: BookDTO })
  @ApiBearerAuth()
  async findAll(/*@Req() request: any*/): Promise<BookDTO[]> {
    /*const jwt = this.extractJWTFromRequest(request);

    if (!this.authService.verifyToken(jwt)) {
      throw new UnauthorizedException('Invalid token');
    }
    */
    this.authService.verifyToken();
    return await this.bookService.readAllBooks();
  }

  private extractJWTFromRequest(request: any): string {
    const jwt = request.headers.authorization;
    if (jwt?.includes('Bearer')) {
      return jwt.split(' ')[1];
    }
    throw new UnauthorizedException('JWT must be provided');
  }
}
