import { ValueObject } from '../../../../src/utils';

interface Props {
  value: number;
}

export class BookStock extends ValueObject<Props> {
  public static with(stock: number): BookStock {
    if (stock < 0) {
      throw new Error('Stock cannot be negative.');
    }

    return new BookStock({ value: stock });
  }

  get value(): number {
    return this.props.value;
  }
}
