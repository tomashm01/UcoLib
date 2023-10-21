import { NotFoundException } from '@nestjs/common';
import { UserEmail, UserId } from '../model';

export class UserNotFoundError extends NotFoundException {
  public static withId(id: UserId): UserNotFoundError {
    return new UserNotFoundError(`USUARIO CON ID ${id.value} NO ENCONTRADO`);
  }
  public static withEmail(email: UserEmail): UserNotFoundError {
    return new UserNotFoundError(
      `USUARIO CON EMAIL ${email.value} NO ENCONTRADO`,
    );
  }
}
