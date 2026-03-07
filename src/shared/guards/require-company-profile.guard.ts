import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';

export class RequireCompanyProfileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<
      Request & {
        user: UserResponseDto;
      }
    >();

    if (!request.user.companyProfile) {
      throw new UnauthorizedException('Company profile not found');
    }

    return true;
  }
}
