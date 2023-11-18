import { ApiProperty } from '@nestjs/swagger';

interface Props {
  id: string;
  barCode: string;
  title: string;
  author: string;
  genre: string;
  image: string;
}

export class CreateBookDTO {
  constructor(props: Props) {
    this.id = props.id;
    this.barCode = props.barCode;
    this.title = props.title;
    this.author = props.author;
    this.genre = props.genre;
    this.image = props.image;
  }

  @ApiProperty({
    example: 'aca98bfc-7b2c-47a0-89c2-23147f97d21d',
    description: 'The id of the book',
  })
  id: string;

  @ApiProperty({
    example: '979-8858358268',
    description: 'The bar code of the book',
  })
  barCode: string;

  @ApiProperty({
    example: 'Clean Architecture',
    description: 'The title of the book',
  })
  title: string;

  @ApiProperty({
    example: 'Juanito',
    description: 'Author of the book',
  })
  author: string;

  @ApiProperty({
    example: 'Action',
    description: 'Genre of the book',
  })
  genre: string;

  @ApiProperty({
    example: 'imagename.jpg',
    format: 'string',
    description: 'return from /upload endpoint',
  })
  image: string;
}
