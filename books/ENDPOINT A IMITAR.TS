import {
  Body,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createGarmentDto: CreateGarmentDto,
    @Req() request: Request,
  ): Promise<Garment> {
    const jwt = request.headers.authorization?.split(' ')[1];
    if (jwt) {
      const decoded = await this.verifyJwtService.verifyJwt(jwt);
      if (decoded && file) {
        createGarmentDto.imagePath = file.path;
        console.log(createGarmentDto);
        return this.garmentService.create(createGarmentDto);
      }
    }
    console.log('no jwt');
    return null;
  }

//EN EL GET ME TENEIS QUE DEVOLVER LA URL DE LA IMAGEN VOSOTROS SEREIS EL HOST, NO TENEIS QUE ENVIARME LA IMAGEN.