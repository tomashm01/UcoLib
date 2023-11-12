import { ApiProperty } from '@nestjs/swagger';

export interface UserProps {
  id: string;
  email: string;
  name: string;
}

interface Props {
  users: UserProps[];
}

export class ReadAllResponse {
  constructor(props: Props) {
    this.users = props.users;
  }

  @ApiProperty({
    example: [
      {
        id: 'a5ce0fa9-1070-40ec-876d-76fea372ba28',
        email: 'john.doe@example.com',
        name: 'John Doe',
      },
    ],
    description: 'The list of users',
  })
  users: UserProps[];
}
