import { Webhook } from './webhook.entity';

export class CompanyWebhook {
  constructor(
    public readonly companyProfileId: string,
    public readonly webhookId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
    public readonly webhook?: Webhook,
  ) {}

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  static create(params: {
    companyProfileId: string;
    webhookId: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | undefined;
    webhook?: Webhook;
  }): CompanyWebhook {
    return new CompanyWebhook(
      params.companyProfileId,
      params.webhookId,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
      params.deletedAt ?? undefined,
      params.webhook ?? undefined,
    );
  }
}
