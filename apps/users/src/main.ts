import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { UserModule } from './infraestructure/app.module';
import { AppLoggerMiddleware } from './app.middleware';
import { ClientKafka } from '@nestjs/microservices/client';
import { Transport } from '@nestjs/microservices/enums';
import { MicroserviceOptions } from '@nestjs/microservices/interfaces';

@Module({
  imports: [UserModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}

async function bootstrap() {
  dotenv.config();

  const appTcp = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['host.docker.internal:9092'],
        },
        consumer: {
          groupId: 'user-consumer',
        },
      },
    },
  );

  const appHttp = await NestFactory.create(UserModule);
  const globalPrefix = 'api';
  appHttp.setGlobalPrefix(globalPrefix);
  appHttp.enableShutdownHooks();

  // Configuración para Swagger
  const config = new DocumentBuilder()
    .setTitle('User API')
    .setVersion('1.0')
    .addTag('Users')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(appHttp, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, appHttp, document);

  appHttp.enableCors(); // Configura según las necesidades de tu aplicación

  // Inicia el servidor HTTP para la API
  const httpPort = process.env.PORT_USER || 3002;
  await appHttp.listen(httpPort);
  Logger.log(
    `🚀 User HTTP API is running on: http://localhost:${httpPort}/${globalPrefix}`,
  );
  Logger.log(
    `📖 Swagger documentation for User API is available on: http://localhost:${httpPort}/${globalPrefix}/docs`,
  );
  await appTcp.listen();
}

bootstrap();
