import { NotFoundException } from '@nestjs/common';
import { BookBarCode, BookId } from '../model';

export class BookNotFoundError extends NotFoundException {
  public static withId(id: BookId): BookNotFoundError {
    return new BookNotFoundError(`LIBRO CON ID ${id.value} NO ENCONTRADO`);
  }
  public static withBarCode(barCode: BookBarCode): BookNotFoundError {
    return new BookNotFoundError(
      `LIBRO CON ISBN-13 ${barCode.value} NO ENCONTRADO`,
    );
  }
}
