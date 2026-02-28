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
    id: string;
    name: string;
    logoUrl: string | undefined;
    userId: string;
    subscriptionPlan: SubscriptionPlan;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | undefined;
  }): CompanyProfile {
    return new CompanyProfile(
      params.id,
      params.name,
      params.logoUrl,
      params.userId,
      params.subscriptionPlan,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
      params.deletedAt ?? undefined,
    );
  }
}
