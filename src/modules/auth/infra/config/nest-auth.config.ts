import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../../application/auth.config';

@Injectable()
export class NestAuthConfig implements AuthConfig {
  constructor(private readonly configService: ConfigService) {}

  getAccessTokenExpiresIn(): string {
    return this.configService.get<string>('NODE_ENV') === 'development'
      ? '15d'
      : '15m';
  }

  getAccessTokenExpiresInSeconds(): number {
    return this.configService.get<string>('NODE_ENV') === 'development'
      ? 15 * 24 * 60 * 60
      : 15 * 60;
  }

  getRefreshTokenExpiresIn(): string {
    return '7d';
  }

  getAccessTokenSecret(): string {
    return this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET');
  }

  getRefreshTokenSecret(): string {
    return this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET');
  }
}
