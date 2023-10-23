import { ApiProperty } from '@nestjs/swagger';

export interface UserProps {
  id: string;
  email: string;
  name: string;
}

interface Props {
  jwt: string;
  users: UserProps[];
}

export class ReadAllResponse {
  constructor(props: Props) {
    this.jwt = props.jwt;
    this.users = props.users;
  }

  @ApiProperty({
    example: 'some_jwt_token',
    description: 'The JWT token',
  })
  jwt: string;

  @ApiProperty({
    example: [
      {
        id: '1',
        email: 'john.doe@example.com',
        name: 'John Doe',
      },
    ],
    description: 'The list of users',
  })
  users: UserProps[];
}
