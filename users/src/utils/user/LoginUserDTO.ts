import { ApiProperty } from '@nestjs/swagger';

interface Props {
  email: string;
  password: string;
}

export class LoginUserDTO {
  constructor(props: Props) {
    this.email = props.email;
    this.password = props.password;
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
  password: string;
}
