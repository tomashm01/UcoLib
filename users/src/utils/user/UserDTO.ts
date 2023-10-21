import { ApiProperty } from '@nestjs/swagger';

interface Props {
  id?: string;
  email: string;
  password: string;
  name: string;
}

export class UserDTO {
  constructor(props: Props) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.name = props.name;
  }

  @ApiProperty({
    example: 'aca98bfc-7b2c-47a0-89c2-23147f97d21d',
    description: 'The id of the user',
  })
  id: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'StrongPasswordHere',
    description: 'The password of the user',
  })
  password: string;

  @ApiProperty({
    example: 'Juanito',
    description: 'The name of the user',
  })
  name: string;
}
