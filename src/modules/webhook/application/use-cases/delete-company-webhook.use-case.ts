import { Inject } from '@nestjs/common';
import { CompanyWebhookRepository } from '../repositories/company-webhook.repository';

export class DeleteCompanyWebhookUseCase {
  constructor(
    @Inject(CompanyWebhookRepository)
    private readonly companyWebhookRepository: CompanyWebhookRepository,
  ) {}

  async execute(webhookId: string, companyProfileId: string): Promise<void> {
    await this.companyWebhookRepository.deleteByWebhookIdAndCompanyProfileId(
      webhookId,
      companyProfileId,
    );
  }
}
