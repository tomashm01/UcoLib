import { Id } from '../../../../src/utils';

export class UserId extends Id {
  public static with(id: string): UserId {
    return new UserId(id);
  }

  get value(): string {
    return this.props.value;
  }
}
