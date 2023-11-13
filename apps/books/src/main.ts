import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppLoggerMiddleware } from './app.middleware';
import { BookModule } from './infraestructure/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger/dist';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

@Module({
  imports: [BookModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}

async function bootstrap() {
  dotenv.config();

  const appTcp = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['host.docker.internal:9092'],
        },
        consumer: {
          groupId: 'book-consumer',
        },
      },
    },
  );
  const appHttp = await NestFactory.create<NestExpressApplication>(BookModule);
  appHttp.useStaticAssets(path.join('uploads'));
  const globalPrefix = 'api';
  appHttp.setGlobalPrefix(globalPrefix);
  appHttp.enableShutdownHooks();

  // Configuración para Swagger
  const config = new DocumentBuilder()
    .setTitle('Book API')
    .setVersion('1.0')
    .addTag('Books')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(appHttp, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, appHttp, document);

  appHttp.enableCors(); // Configura según las necesidades de tu aplicación

  // Inicia el servidor HTTP para la API
  const httpPort = process.env.PORT_BOOK || 3000;
  await appHttp.listen(httpPort);
  Logger.log(
    `🚀 Book HTTP API is running on: http://localhost:${httpPort}/${globalPrefix}`,
  );
  Logger.log(
    `📖 Swagger documentation for Book API is available on: http://localhost:${httpPort}/${globalPrefix}/docs`,
  );
  await appTcp.listen();
}

bootstrap();
