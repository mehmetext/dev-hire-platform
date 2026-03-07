import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/application/repositories/user.repository';
import { UserNotFoundError } from 'src/modules/user/domain/errors';
import { InvalidTokenError } from '../../domain/errors';
import { AuthConfig } from '../auth.config';
import { LoginResult } from '../dtos/login.result';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { TokenGeneratorRepository } from '../repositories/token-generator.repository';
import { LoginUseCase } from './login.use-case';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(TokenGeneratorRepository)
    private readonly tokenGenerator: TokenGeneratorRepository,
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(LoginUseCase) private readonly loginUseCase: LoginUseCase,
    @Inject(AuthConfig)
    private readonly authConfig: AuthConfig,
  ) {}

  async execute(oldRefreshToken: string): Promise<LoginResult> {
    let payload: { sub: string; jti: string };

    try {
      payload = await this.tokenGenerator.verifyToken(oldRefreshToken, {
        secret: this.authConfig.getRefreshTokenSecret(),
      });
    } catch {
      throw new InvalidTokenError();
    }

    const savedToken = await this.refreshTokenRepository.findByUserIdAndJti(
      payload.sub,
      payload.jti,
    );

    if (!savedToken) {
      throw new InvalidTokenError();
    }

    if (savedToken !== oldRefreshToken) {
      await this.refreshTokenRepository.delete(payload.sub, payload.jti);
      throw new InvalidTokenError();
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.refreshTokenRepository.delete(payload.sub, payload.jti);

    return this.loginUseCase.execute(user);
  }
}
