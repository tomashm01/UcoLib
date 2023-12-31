import { ValueObject } from '../../../../src/utils';

interface Props {
  value: string;
}

export class BookBarCode extends ValueObject<Props> {
  public static readonly maxLength: number = 14;

  public static with(barCode: string): BookBarCode {
    if (barCode.length === 0) {
      throw new Error('BarCode cannot be empty');
    }

    if (barCode.length > BookBarCode.maxLength) {
      throw new Error(
        `BarCode cannot be longer than ${BookBarCode.maxLength} characters`,
      );
    }

    return new BookBarCode({ value: barCode });
  }

  get value(): string {
    return this.props.value;
  }
}
