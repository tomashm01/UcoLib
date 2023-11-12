import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ClientKafka } from '@nestjs/microservices';

export const AUTH_SERVICE="AUTH_SERVICE";

@Injectable()
export class AuthService implements OnModuleInit{
  constructor(private readonly jwtService: JwtService,
    @Inject("USER_SERVICE") private readonly userService: ClientKafka) {}

  onModuleInit(){
    this.userService.subscribeToResponseOf("user-token-topic")
  }

  verifyToken(): void {
    this.userService.send(
      "user-token-topic", {}
    ).subscribe(message=>console.log(message));
  }
}
