import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/modules/user/application/repositories/user.repository';
import { UserNotFoundError } from 'src/modules/user/domain/errors';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { AuthConfig } from '../../application/auth.config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthConfig)
    private readonly authConfig: AuthConfig,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.getAccessTokenSecret(),
    });
  }

  async validate(payload: {
    sub: string;
    jti: string;
  }): Promise<UserResponseDto & { jti: string }> {
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UserNotFoundError();
    }

    return {
      jti: payload.jti,
      id: user.id,
      email: user.email.value,
      role: user.role,
      companyProfile: user.companyProfile,
      candidateProfile: user.candidateProfile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
