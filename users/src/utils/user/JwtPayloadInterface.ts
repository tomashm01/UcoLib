import { ApiProperty } from '@nestjs/swagger';

interface Props {
  id: string;
  email: string;
}

export class JwtPayloadInterface {
  constructor(props: Props) {
    this.id = props.id;
    this.email = props.email;
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
}
