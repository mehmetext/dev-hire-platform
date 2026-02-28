import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { subscriptionPlans } from 'src/shared/constants/subscriptions';
import { JobRepository } from '../../application/repositories/job.repository';

export class JobsLimitGuard implements CanActivate {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: UserResponseDto }>();

    const companyProfile = request.user.companyProfile;
    if (!companyProfile) {
      throw new UnauthorizedException('Company profile not found');
    }

    const maxJobs = subscriptionPlans[companyProfile.subscriptionPlan].maxJobs;

    const currentCount = await this.jobRepository.countByCompanyId(
      companyProfile.id,
    );

    if (currentCount >= maxJobs) {
      throw new ForbiddenException(
        `Job limit reached. Your ${companyProfile.subscriptionPlan} plan allows maximum ${maxJobs} jobs.`,
      );
    }

    return true;
  }
}
