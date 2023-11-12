import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USER_FINDER, UserFinder } from '../../../src/application';
import { JwtPayloadInterface, UserDTO } from '../../../src/utils';
import { UserId } from '../user';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_FINDER) private readonly userFinder: UserFinder,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<UserDTO> {
    const user: UserDTO = await this.userFinder.findById(
      UserId.with(payload.id),
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
