import { ValueObject } from 'src/utils';

interface Props {
  value: string;
}

export class UserName extends ValueObject<Props> {
  public static with(name: string): UserName {
    if (name.length === 0) {
      throw new Error('Name cannot be empty');
    }
    return new UserName({ value: name });
  }
  get value(): string {
    return this.props.value;
  }
}
