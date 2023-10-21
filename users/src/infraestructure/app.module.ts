import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from '../conf/configuration';
import { UserProviders } from 'src/infraestructure/user.providers';
import { USER_PROJECTION, UserSchema } from './projection';
import { UserController } from './controller/user.controller';

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
    MongooseModule.forFeature([{ name: USER_PROJECTION, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [...UserProviders],
})
export class UserModule {}
