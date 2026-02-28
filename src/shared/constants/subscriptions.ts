import { SubscriptionPlan } from 'src/modules/company/domain/enums/subscription-plan.enum';

export const subscriptionPlans: Record<SubscriptionPlan, { maxJobs: number }> =
  {
    FREE: {
      maxJobs: 3,
    },
    PRO: {
      maxJobs: 10,
    },
    ENTERPRISE: {
      maxJobs: 100,
    },
  };
