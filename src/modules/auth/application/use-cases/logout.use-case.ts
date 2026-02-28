import { Inject } from '@nestjs/common';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

export class LogoutUseCase {
  constructor(
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(userId: string, jti: string): Promise<void> {
    await this.refreshTokenRepository.delete(userId, jti);
  }
}
