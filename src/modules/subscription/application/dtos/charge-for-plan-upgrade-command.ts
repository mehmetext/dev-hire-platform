import { SubscriptionPlan } from 'src/modules/company/domain/enums/subscription-plan.enum';

export class ChargeForPlanUpgradeCommand {
  constructor(
    public readonly companyProfileId: string,
    public readonly plan: SubscriptionPlan,
  ) {}
}
