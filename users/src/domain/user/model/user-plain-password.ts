import { ValueObject } from 'src/utils';

interface Props {
  value: string;
}

export class UserPlainPassword extends ValueObject<Props> {
  public static with(password: string): UserPlainPassword {
    this.check(password);
    return new UserPlainPassword({ value: password });
  }

  get value(): string {
    return this.props.value;
  }

  public static check(password: string): void {
    if (password.length < 8) {
      throw new Error('Password too short');
    }
  }
}
