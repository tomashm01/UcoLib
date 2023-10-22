import { ValueObject } from 'src/utils';

interface Props {
  value: string;
}

export class UserEncryptedPassword extends ValueObject<Props> {
  public static with(password: string): UserEncryptedPassword {
    return new UserEncryptedPassword({ value: password });
  }

  get value(): string {
    return this.props.value;
  }
}
