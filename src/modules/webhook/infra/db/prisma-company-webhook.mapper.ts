import {
  CompanyWebhook as PrismaCompanyWebhook,
  Webhook as PrismaWebhook,
} from 'src/generated/prisma/client';
import { CompanyWebhook } from '../../domain/entities/company-webhook.entity';
import { Webhook } from '../../domain/entities/webhook.entity';

type PrismaCompanyWebhookWithWebhook = PrismaCompanyWebhook & {
  webhook: PrismaWebhook;
};

export class PrismaCompanyWebhookMapper {
  static toDomain(
    row:
      | PrismaCompanyWebhookWithWebhook
      | (PrismaCompanyWebhook & { webhook?: PrismaWebhook }),
  ): CompanyWebhook {
    const webhook = row.webhook
      ? Webhook.create({
          id: row.webhook.id,
          webhookUrl: row.webhook.webhookUrl,
          createdAt: row.webhook.createdAt,
          updatedAt: row.webhook.updatedAt,
          deletedAt: row.webhook.deletedAt ?? undefined,
        })
      : undefined;

    return CompanyWebhook.create({
      companyProfileId: row.companyProfileId,
      webhookId: row.webhookId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
      webhook,
    });
  }
}
