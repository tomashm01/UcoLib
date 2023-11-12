import { ValueObject } from '../../../../src/utils';

interface Props {
  value: string;
}

export class BookTitle extends ValueObject<Props> {
  public static with(name: string): BookTitle {
    if (name.length === 0) {
      throw new Error('Title cannot be empty');
    }
    return new BookTitle({ value: name });
  }
  get value(): string {
    return this.props.value;
  }
}
