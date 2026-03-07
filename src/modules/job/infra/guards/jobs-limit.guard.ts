import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CompanyProfile } from 'src/modules/company/domain/entities/company-profile.entity';
import { SubscriptionLimitService } from 'src/modules/subscription/application/subscription-limit.service';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';

export class JobsLimitGuard implements CanActivate {
  constructor(
    @Inject(SubscriptionLimitService)
    private readonly subscriptionLimitService: SubscriptionLimitService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: UserResponseDto }>();

    const companyProfile = request.user.companyProfile!;

    const maxJobs = this.subscriptionLimitService.getMaxJobsForPlan(
      companyProfile.subscriptionPlan,
    );

    const canCreateJob = await this.subscriptionLimitService.canCreateJob(
      CompanyProfile.create({
        id: companyProfile.id,
        name: companyProfile.name,
        logoUrl: companyProfile.logoUrl ?? undefined,
        userId: request.user.id,
        subscriptionPlan: companyProfile.subscriptionPlan,
        createdAt: companyProfile.createdAt,
        updatedAt: companyProfile.updatedAt,
        deletedAt: companyProfile.deletedAt ?? undefined,
      }),
    );

    if (!canCreateJob) {
      throw new ForbiddenException(
        `Job limit reached. Your ${companyProfile.subscriptionPlan} plan allows maximum ${maxJobs} jobs.`,
      );
    }

    return true;
  }
}
