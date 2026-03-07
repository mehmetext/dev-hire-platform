import { SubscriptionPlan } from 'src/modules/company/domain/enums/subscription-plan.enum';

export class UpgradeCompanySubscriptionCommand {
  constructor(
    public readonly companyProfileId: string,
    public readonly plan: SubscriptionPlan,
  ) {}
}
