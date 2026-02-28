import { SubscriptionPlan } from 'src/modules/company/domain/enums/subscription-plan.enum';

export interface SubscriptionPlanConfig {
  maxJobs: number;
  maxJobApplicationsPerJob: number;
}

export const subscriptionPlans: Record<
  SubscriptionPlan,
  SubscriptionPlanConfig
> = {
  FREE: {
    maxJobs: 3,
    maxJobApplicationsPerJob: 10,
  },
  PRO: {
    maxJobs: 10,
    maxJobApplicationsPerJob: 100,
  },
  ENTERPRISE: {
    maxJobs: 100,
    maxJobApplicationsPerJob: 1000,
  },
};
