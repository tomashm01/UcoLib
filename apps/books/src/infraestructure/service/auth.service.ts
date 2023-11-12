import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
export const AUTH_SERVICE = 'AUTH_SERVICE';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.userService.subscribeToResponseOf('user-token-topic');
  }

  async verifyToken(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userService.send('user-token-topic', token).subscribe({
        next: (response: boolean) => {
          resolve(response);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
}
