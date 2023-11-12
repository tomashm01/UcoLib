import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from '../conf/configuration';
import { BookProviders } from '../../src/infraestructure/book.providers';

import { BookController } from './controller/book.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BOOK_PROJECTION, BookSchema } from './projection';
import { ClientsModule } from '@nestjs/microservices/module';
import { Transport } from '@nestjs/microservices/enums';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.local',
        '.env',
      ],
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().database.uri, {}),
    MongooseModule.forFeature([{ name: BOOK_PROJECTION, schema: BookSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    PassportModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "user",
            brokers: ['host.docker.internal:9092'],
          },
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [BookController],
  providers: [...BookProviders],
})
export class BookModule {}
