import { ValueObject } from '../../../../src/utils';

interface Props {
  value: string;
}

export class BookImage extends ValueObject<Props> {
  public static with(name: string): BookImage {
    return new BookImage({ value: name });
  }
  get value(): string {
    return this.props.value;
  }
}
