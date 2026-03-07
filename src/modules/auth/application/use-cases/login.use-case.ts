import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { AuthConfig } from '../auth.config';
import { LoginResult } from '../dtos/login.result';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { TokenGeneratorRepository } from '../repositories/token-generator.repository';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(TokenGeneratorRepository)
    private readonly tokenGenerator: TokenGeneratorRepository,
    @Inject(AuthConfig)
    private readonly authConfig: AuthConfig,
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(user: User): Promise<LoginResult> {
    const jti = crypto.randomUUID();
    const payload = { sub: user.id, jti };

    const accessTokenExpiresIn = this.authConfig.getAccessTokenExpiresIn();
    const accessTokenExpiresInSeconds =
      this.authConfig.getAccessTokenExpiresInSeconds();

    const accessToken = await this.tokenGenerator.generateToken(payload, {
      expiresIn: accessTokenExpiresIn,
      secret: this.authConfig.getAccessTokenSecret(),
    });
    const refreshToken = await this.tokenGenerator.generateToken(payload, {
      expiresIn: this.authConfig.getRefreshTokenExpiresIn(),
      secret: this.authConfig.getRefreshTokenSecret(),
    });

    await this.refreshTokenRepository.save(
      user.id,
      jti,
      refreshToken,
      7 * 24 * 60 * 60,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresInSeconds,
      user: {
        id: user.id,
        email: user.email.value,
        role: user.role,
        companyProfile: user.companyProfile,
        candidateProfile: user.candidateProfile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
    };
  }
}
