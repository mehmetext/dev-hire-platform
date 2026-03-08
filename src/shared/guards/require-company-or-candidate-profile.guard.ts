import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';

export class RequireCompanyOrCandidateProfileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<
      Request & {
        user: UserResponseDto;
      }
    >();

    const hasCompanyProfile = !!request.user.companyProfile;
    const hasCandidateProfile = !!request.user.candidateProfile;

    if (!hasCompanyProfile && !hasCandidateProfile) {
      throw new UnauthorizedException(
        'Company profile or candidate profile not found',
      );
    }

    return true;
  }
}
