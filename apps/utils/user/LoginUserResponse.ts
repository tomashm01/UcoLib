import { ApiProperty } from '@nestjs/swagger';

interface Props {
  jwt: string;
  email: string;
  name: string;
}

export class LoginUserResponse {
  constructor(props: Props) {
    this.jwt = props.jwt;
    this.email = props.email;
    this.name = props.name;
  }

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'Juanito',
    description: 'The name of the user',
  })
  name: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: 'The token of the user',
  })
  jwt: string;
}
