import { Injectable } from '@nestjs/common';
import { CompanyWebhook } from '../../domain/entities/company-webhook.entity';
import { RegisterCompanyWebhookCommand } from '../dtos/register-company-webhook.command';

@Injectable()
export abstract class CompanyWebhookRepository {
  abstract register(
    command: RegisterCompanyWebhookCommand,
  ): Promise<CompanyWebhook>;
  abstract findByCompanyProfileId(
    companyProfileId: string,
  ): Promise<CompanyWebhook[]>;
  abstract deleteByWebhookIdAndCompanyProfileId(
    webhookId: string,
    companyProfileId: string,
  ): Promise<void>;
}
