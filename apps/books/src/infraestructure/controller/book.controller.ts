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
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { AUTH_SERVICE, AuthService, BOOK_SERVICE, BookService } from '../service';
import { BookDTO } from '../../../src/utils';
import { BookNotFoundError } from '../../../src/domain';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { CreateBookDTO } from '../../utils/book/CreateBookDTO';


@ApiTags('BookController')
@Controller('book')
export class BookController {
  constructor(
    @Inject(BOOK_SERVICE) private readonly bookService: BookService,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {}

  @Get(':barcode')
  @ApiOperation({ summary: 'Obtener un libro por barcode' })
  @ApiOkResponse({ type: BookDTO })
  @ApiBearerAuth()
  async findOne(
    @Param('barcode') barcode: string,
    @Req() request: any,
  ): Promise<BookDTO | null> {
    const jwt = this.extractJWTFromRequest(request);

    const isTokenValid= await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    
    try {
      const book: BookDTO = await this.bookService.readBookByBarcode(barcode);
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
  @ApiBody({ type: CreateBookDTO })
  @ApiOkResponse({ type: BookDTO })
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() BookDTO: CreateBookDTO,
    @Req() request: any,
    @UploadedFile() file: Express.Multer.File
  ): Promise<BookDTO> {
    const jwt = this.extractJWTFromRequest(request);

    const isTokenValid= await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    return await this.bookService.createBook(BookDTO);
  }



  @Patch('/stock/:barcode')
  @ApiOperation({ summary: 'libro +1 stock' })
  @ApiOkResponse()
  @ApiBearerAuth()
  async update(
    @Param('barcode') barcode: string, @Req() request: any,
  ): Promise<BookDTO> {
    const jwt = this.extractJWTFromRequest(request);

    const isTokenValid= await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      return await this.bookService.updateBook(barcode);
    } catch (e) {
      if (e instanceof BookNotFoundError) {
        throw new ConflictException(e.message);
      } else {
        throw e;
      }
    }
  }
  @Delete('/stock/:barcode')
  @ApiOperation({ summary: 'Eliminar un libro por barcode' })
  @ApiOkResponse()
  @ApiBearerAuth()
  async deleteStock(
    @Param('barcode') barcode: string, @Req() request: any,
  ): Promise<string> {
    const jwt = this.extractJWTFromRequest(request);

    const isTokenValid= await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      await this.bookService.deleteStock(barcode);
      return 'Book <' + barcode + '> stock  ';
    } catch (e) {
      if (e instanceof BookNotFoundError) {
        throw new NotFoundException(e.message);
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
    @Param('id') id: string, @Req() request: any,
  ): Promise<string> {
    const jwt = this.extractJWTFromRequest(request);

    const isTokenValid= await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
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
  async findAll(@Req() request: any): Promise<BookDTO[]> {
    const jwt = this.extractJWTFromRequest(request);

    const isTokenValid= await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }
    return await this.bookService.readAllBooks();
  }

  private extractJWTFromRequest(request: any): string {
    const jwt = request.headers.authorization;
    if (jwt?.includes('Bearer')) {
      return jwt.split(' ')[1];
    }
    throw new UnauthorizedException('JWT must be provided');
  }

  @Post("/upload")
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: path.join('uploads')
    }),
  }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() request: any ) {
    const jwt = this.extractJWTFromRequest(request);

    const isTokenValid= await this.authService.verifyToken(jwt);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      filename: file.filename
    };
  }

}
