import { Id } from '../../../../src/utils';

export class BookId extends Id {
  public static with(id: string): BookId {
    return new BookId(id);
  }

  get value(): string {
    return this.props.value;
  }
}
