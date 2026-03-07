import { Inject, Injectable } from '@nestjs/common';
import { CompanyProfile } from 'src/modules/company/domain/entities/company-profile.entity';
import { JobRepository } from 'src/modules/job/application/repositories/job.repository';
import { subscriptionPlans } from 'src/shared/constants/subscriptions';

@Injectable()
export class SubscriptionLimitService {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async canCreateJob(companyProfile: CompanyProfile): Promise<boolean> {
    const planConfig = subscriptionPlans[companyProfile.subscriptionPlan];

    if (!planConfig) {
      return false;
    }

    const currentJobsCount = await this.jobRepository.countByCompanyId(
      companyProfile.id,
    );

    return currentJobsCount < planConfig.maxJobs;
  }

  async getRemainingJobs(companyProfile: CompanyProfile): Promise<number> {
    const planConfig = subscriptionPlans[companyProfile.subscriptionPlan];

    if (!planConfig) {
      return 0;
    }

    const currentJobsCount = await this.jobRepository.countByCompanyId(
      companyProfile.id,
    );

    return Math.max(0, planConfig.maxJobs - currentJobsCount);
  }
}
