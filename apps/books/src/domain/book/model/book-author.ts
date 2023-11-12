import { ValueObject } from '../../../../src/utils';

interface Props {
  value: string;
}

export class BookAuthor extends ValueObject<Props> {
  public static with(name: string): BookAuthor {
    if (name.length === 0) {
      throw new Error('Name cannot be empty');
    }
    return new BookAuthor({ value: name });
  }
  get value(): string {
    return this.props.value;
  }
}
