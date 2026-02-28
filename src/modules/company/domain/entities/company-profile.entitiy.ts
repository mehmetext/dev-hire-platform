import { randomUUID } from 'crypto';
import { SubscriptionPlan } from '../enums/subscription-plan.enum';

export class CompanyProfile {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly logoUrl: string | undefined,
    public readonly userId: string,
    public readonly subscriptionPlan: SubscriptionPlan,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
  ) {}

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  static create(params: {
    name: string;
    logoUrl: string | undefined;
    userId: string;
    subscriptionPlan: SubscriptionPlan;
  }): CompanyProfile {
    return new CompanyProfile(
      randomUUID(),
      params.name,
      params.logoUrl,
      params.userId,
      params.subscriptionPlan,
      new Date(),
      new Date(),
      undefined,
    );
  }
}
