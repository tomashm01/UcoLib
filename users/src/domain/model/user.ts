import { UserId } from './user-id';
import { UserEmail } from './user-email';
import { UserPassword } from './user-password';
import { UserName } from './user-name';

export class User {
  private _userId: UserId;
  private _email: UserEmail;
  private _password: UserPassword;
  private _name: UserName;

  constructor(
    userId: UserId,
    email: UserEmail,
    password: UserPassword,
    username: UserName,
  ) {
    this._userId = userId;
    this._email = email;
    this._password = password;
    this._name = username;
  }

  public static add(
    userId: UserId,
    email: UserEmail,
    password: UserPassword,
    username: UserName,
  ): User {
    const user = new User(userId, email, password, username);
    return user;
  }

  get id(): UserId {
    return this._userId;
  }

  get email(): UserEmail {
    return this._email;
  }

  get password(): UserPassword {
    return this._password;
  }

  get name(): UserName {
    return this._name;
  }
}
