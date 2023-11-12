import { ValueObject, GenreEnum } from '../../../../src/utils';

interface Props {
  value: string;
}

export class BookGenre extends ValueObject<Props> {
  public static with(genre: string): BookGenre {
    if (GenreEnum[genre.toUpperCase()] === undefined) {
      throw new Error('Genre is not supported');
    }
    return new BookGenre({ value: genre });
  }
  get value(): string {
    return this.props.value;
  }
}
